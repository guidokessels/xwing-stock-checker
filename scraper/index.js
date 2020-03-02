const Xray = require("x-ray");
const jsonfile = require("jsonfile");
const stores = require("../config.json");
const filters = require("./filters");

const { scrapeWebhallen } = require("./webhallen");

const DATA_FOLDER = __dirname + "/../data/";
const SRC_FOLDER = __dirname + "/../app/src/";

const x = new Xray({ filters });

const writeResultsToFile = (file, results) =>
  jsonfile.writeFile(file, results, { spaces: 2 });

function filterItems(item) {
  return (
    !item.name.startsWith("GF9 ") &&
    !item.name.startsWith("Grips") &&
    !item.name.includes("(1st Ed)") &&
    !item.name.includes("different colours") &&
    // !item.name.includes("1st Edition") &&
    !item.name.includes("för dig som köper Core Set i vår butik")
  );
}

const run = async () => {
  const results = stores
    .filter(s => s.selectors)
    .map(async (store, i) => {
      console.log(`Scraping ${store.name}...`);

      let currentPageUrl = "";

      let promise;

      if (!store.openProductPage) {
        promise = x(store.url, store.selectors.item, [
          {
            name: store.selectors.itemName,
            price: store.selectors.itemPrice,
            image: store.selectors.itemImage,
            url: store.selectors.itemUrl,
            stock: store.selectors.stock
          }
        ]);
      } else {
        promise = x(store.url, store.selectors.item, [
          {
            url: store.selectors.itemUrl
          }
        ]);
      }

      let response = await promise
        .paginate(store.selectors.pagination)
        .abort((_result, nextPageUrl) => {
          const shouldAbort = currentPageUrl === nextPageUrl;
          currentPageUrl = nextPageUrl;
          return shouldAbort;
        });

      if (store.openProductPage) {
        response = await Promise.all(
          response.map(({ url }) => {
            return x(url, {
              name: store.selectors.itemName,
              price: store.selectors.itemPrice,
              image: store.selectors.itemImage,
              stock: store.selectors.stock
            }).then(r => ({ ...r, url }));
          }, [])
        );
      }

      console.log(`Found ${response.length} products for ${store.name}`);

      const result = {
        ...store,
        items: response.filter(filterItems).map(product => ({
          ...product,
          store: store.id
        }))
      };

      return writeResultsToFile(DATA_FOLDER + store.file, result).then(
        () => result
      );
    });

  results.push(scrapeWebhallen(stores.find(s => s.name === "Webhallen")));

  const allResults = await Promise.all(results);

  console.log("Merging all products");
  const allItems = allResults.reduce((products, store) => {
    return products.concat(store.items);
  }, []);

  const itemsById = allItems.reduce((map, item) => {
    const id = item.name.toLowerCase().replace(/[\W_]+/g, "-");

    if (!map[id]) {
      map[id] = [];
    }
    map[id].push(item);

    return map;
  }, {});

  console.log(`Found ${Object.keys(itemsById).length} unique items`);

  writeResultsToFile(SRC_FOLDER + "data.json", {
    timestamp: Date.now(),
    stores: stores.reduce((storesById, store) => {
      storesById[store.id] = store;
      return storesById;
    }, {}),
    itemsById
  });

  console.log("All done!");
};

run();
