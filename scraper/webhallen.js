const fetch = require("node-fetch");
const jsonfile = require("jsonfile");
const filters = require("./filters");

const getUrlForPage = pageNr => {
  const url = `https://www.webhallen.com/api/search`;
  const query = `query%5BsortBy%5D=sales&query%5Bfilters%5D%5B0%5D%5Btype%5D=category&query%5Bfilters%5D%5B0%5D%5Bvalue%5D=4667&query%5BminPrice%5D=0&query%5BmaxPrice%5D=999999&page=${pageNr}&noCount=false`;
  return `${url}?${query}`;
};

const fetchNextPage = async (pageNr = 0, allProducts = []) => {
  const response = await fetch(getUrlForPage(pageNr));
  const { products, totalProductCount } = await response.json();

  allProducts.push(...products);
  if (allProducts.length < totalProductCount && products.length > 0) {
    return await fetchNextPage(pageNr + 1, allProducts);
  }
  return allProducts;
};

const secondeditionrelease = new Date(Date.UTC("2018", "08", "01"));
const secondeditionreleaseTimestamp = secondeditionrelease.getTime() / 1000;

const scrapeWebhallen = async storeConfig => {
  console.log(`Scraping Webhallen`);
  const allProducts = await fetchNextPage();
  // console.log(`Found ${allProducts.length} X-Wing products for Webhallen`);

  // All second edition products were released after august 2018
  const SecondEdProducts = allProducts.filter(
    d => d.release.timestamp > secondeditionreleaseTimestamp
  );
  console.log(`Found ${SecondEdProducts.length} products for Webhallen`);

  const results = SecondEdProducts.map(p => {
    const product = {
      name: filters.whitespace(filters.fixTitle(p.name)),
      price: filters.toNum(filters.price(p.price.price)),
      image: null,
      url: `https://www.webhallen.com/se/product/${p.id}`,
      stock: Object.entries(p.stock)
        .filter(
          ([name, _]) =>
            ["supplier", "displayCap", "orders"].indexOf(name) === -1
        )
        .reduce((total, [_, stock]) => total + stock, 0),

      store: storeConfig.id
    };
    return product;
  });

  const store = {
    ...storeConfig,
    items: results
  };

  await jsonfile.writeFile(__dirname + "/../data/webhallen.json", store, {
    spaces: 2
  });

  return store;
};

module.exports = { scrapeWebhallen };
