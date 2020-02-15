const Xray = require("x-ray");
const jsonfile = require("jsonfile");
const stores = require("../config.json");

const DATA_FOLDER = __dirname + "/../data/";
const SRC_FOLDER = __dirname + "/../app/src/";

const x = new Xray({
  filters: {
    whitespace: value => {
      return value.replace(/\\n/g, "").trim();
    },
    price: value => {
      return value.replace(/(sek|kr)/, "");
    },
    toNum: value => parseInt(value),
    dlstock: value => value === "Ja",
    sfbstock: value => value === "Köp",
    wobstock: value => value === "K�p",
    asstock: value => parseInt(value, 10) || 0,
    fixTitle: value => {
      const original = value;
      value = value.replace("(Second Edition):", "");
      value = value.replace("Star Wars: X-Wing (Second Edition) -", "");
      value = value.replace("Expansion Pack", "");
      value = value.replace("(Exp.)", "");
      value = value.replace("Star Wars X-Wing:", "");
      value = value.replace("Star Wars X-Wing", "");
      value = value.replace("Star Wars: X-Wing Second Edition - ", "");
      value = value.replace("Star Wars: X-Wing", "");
      value = value.replace("Expansion Pack", "");
      value = value.replace(/Expansion/i, "");
      value = value.replace("(2nd ed)", "");
      value = value.replace("(1st ed)", "(1st Edition)");
      value = value.replace("’", "'");
      value = value.replace("Maneuver Dials", "Maneuver Dial Upgrade Kit");
      value = value.replace("3x3 ~ 91,5x91,5cm (Mousepad)", "");
      value = value.replace("3x3 ~ 91,5x91,5cm (PVC)", "");
      value = value.replace("Play Mat", "Playmat");
      value = value.replace("Slave I", "Slave 1");

      value = value.trim();

      if (value.endsWith("Playmat")) {
        value = "Playmat " + value.replace("Playmat", "");
      }

      // DL has mistyped TIE/ln as TIE/In
      if (value === "TIE/In Fighter") {
        return "TIE/ln Fighter";
      }

      if (
        original === "Star Wars: X-Wing Second Edition" ||
        value === "2nd Core Set" ||
        value === "Core Set" ||
        original === "Star Wars: X-Wing (Second Edition)"
      ) {
        return "Core Set (2nd Edition)";
      }
      if (value === "Force Awakens Core Set") {
        return "Core Set (1st Edition - The Force Awakens)";
      }
      if (value === "Core Set (1st Edition)") {
        return "Core Set (1st Edition - Original)";
      }
      if (value.includes("Never Tell Me")) {
        return "Never Tell Me the Odds Obstacles Pack";
      }
      if (value.includes("Fully Loaded")) {
        return "Fully Loaded Devices Pack";
      }
      if (value.includes("Hotshots")) {
        return "Hotshots and Aces Reinforcements Pack";
      }

      return value;
    }
  }
});

const writeResultsToFile = (file, results) =>
  jsonfile.writeFile(file, results, { spaces: 2 });

function streamToString(stream) {
  const chunks = [];
  return new Promise((resolve, reject) => {
    stream.on("data", chunk => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });
}

function filterItems(item) {
  return (
    !item.name.startsWith("GF9 ") &&
    // !item.name.includes("1st Edition") &&
    !item.name.includes("för dig som köper Core Set i vår butik")
  );
}

const run = async () => {
  const results = stores.map(async (store, i) => {
    console.log(`Scraping ${store.name}...`);

    let currentPageUrl = "";
    const response = await x(store.url, store.selectors.item, [
      {
        name: store.selectors.itemName,
        price: store.selectors.itemPrice,
        image: store.selectors.itemImage,
        url: store.selectors.itemUrl,
        stock: store.selectors.stock
      }
    ])
      .paginate(store.selectors.pagination)
      .abort((_result, nextPageUrl) => {
        const shouldAbort = currentPageUrl === nextPageUrl;
        currentPageUrl = nextPageUrl;
        return shouldAbort;
      });

    console.log(`Found ${response.length} products for ${store.name}`);

    const result = {
      ...store,
      items: response.filter(filterItems).map(product => ({
        ...product,
        store: store.id,
        storeIndex: i
      }))
    };

    return writeResultsToFile(DATA_FOLDER + store.file, result).then(
      () => result
    );
  });
  const allResults = await Promise.all(results);

  console.log("Merging");
  const allItems = allResults.reduce((products, store) => {
    return products.concat(store.items);
  }, []);

  const itemsById = allItems.reduce((map, item) => {
    const id = item.name.toLowerCase();

    if (!map[id]) {
      map[id] = [];
    }
    map[id][item.storeIndex] = item;

    return map;
  }, {});

  console.log(`Found ${Object.keys(itemsById).length} unique items`);

  writeResultsToFile(SRC_FOLDER + "data.json", {
    stores: stores.reduce((acc, store) => {
      acc[store.id] = store;
      return acc;
    }, {}),
    itemsById
  });

  console.log("All done!");
};

run();
