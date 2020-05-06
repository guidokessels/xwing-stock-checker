import jsonfile from "jsonfile";
import Xray from "x-ray";
import findWorkspaceRoot from "find-yarn-workspace-root";
import storesConfig from "./config.json";
import filters from "./filters";
import { Item, ScrapedItem, StoreConfig, StoreWithScrapedItems } from "./types";
import { scrapeWebhallen } from "./webhallen";

const workspaceRoot = findWorkspaceRoot();
const DATA_FOLDER = `${workspaceRoot}/data/`;
const SRC_FOLDER = `${workspaceRoot}/app/src/`;

const stores = storesConfig as StoreConfig[];

const x = new Xray({ filters }).throttle(5, 100);

const writeResultsToFile = (file: string, results: any) =>
  jsonfile.writeFile(file, results, { spaces: 2 });

function filterItems(item) {
  return (
    (!item.sku || (item.sku && item.sku.search(/^SW[Z|S]/) > -1)) &&
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
    .filter((s) => s.selectors)
    .map(async (store, i) => {
      console.log(`Scraping ${store.name}...`);

      let currentPageUrl = "";
      let promise;

      try {
        if (!store.openProductPage) {
          promise = x(store.url, store.selectors.item, [
            {
              name: store.selectors.itemName,
              price: store.selectors.itemPrice,
              image: store.selectors.itemImage,
              url: store.selectors.itemUrl,
              stock: store.selectors.stock,
              sku: store.selectors.sku,
            },
          ]);
        } else {
          promise = x(store.url, store.selectors.item, [
            {
              url: store.selectors.itemUrl,
            },
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
                stock: store.selectors.stock,
                sku: store.selectors.sku,
              }).then((r) => ({ ...r, url }));
            }, [])
          );
        }

        console.log(`Found ${response.length} products for ${store.name}`);

        const result = {
          ...store,
          items: response.filter(filterItems).map((product) => ({
            ...product,
            store: store.id,
          })),
        };

        return writeResultsToFile(DATA_FOLDER + store.file, result).then(
          () => result
        );
      } catch (e) {
        console.error(
          `Something went wrong fetching data for ${store.name} :(`
        );
        console.error(`ERROR:`, e);

        return Promise.resolve({});
      }
    });

  results.push(scrapeWebhallen(stores.find((s) => s.name === "Webhallen")));

  const allResults: StoreWithScrapedItems[] = await Promise.all(results);

  console.log("Merging all products");
  const allItems = allResults.reduce((products: ScrapedItem[], store) => {
    if (!store.items) return products;
    return products.concat(store.items);
  }, []);

  type ItemsById = {
    [itemId: string]: Item;
  };

  const itemsById: ItemsById = allItems.reduce(
    (map, { name, image, ...rest }) => {
      const id = name.toLowerCase().replace(/[\W_]+/g, "-");

      if (!map[id]) {
        map[id] = {
          stores: [],
        };
      }
      if (!map[id].name) {
        map[id].name = name;
      }
      if (!map[id].image) {
        map[id].image = image;
      }
      map[id].stores.push(rest);

      return map;
    },
    {}
  );

  console.log(`Found ${Object.keys(itemsById).length} unique items`);

  writeResultsToFile(SRC_FOLDER + "data.json", {
    // timestamp: Date.now(),
    stores: stores.reduce((storesById, store) => {
      const { name, id, url } = store;
      storesById[store.id] = { name, id, url };
      return storesById;
    }, {}),
    itemsById,
  });

  console.log("All done!");
};

run();
