import jsonfile from "jsonfile";
import fetch from "node-fetch";
import findWorkspaceRoot from "find-yarn-workspace-root";
import filters from "./filters";
import { ScrapedItem, StoreConfig, StoreWithScrapedItems } from "./types";

const workspaceRoot = findWorkspaceRoot();
const getUrlForPage = (pageNr: number) => {
  const url = `https://www.webhallen.com/api/search`;
  const query = `query%5BsortBy%5D=sales&query%5Bfilters%5D%5B0%5D%5Btype%5D=category&query%5Bfilters%5D%5B0%5D%5Bvalue%5D=4667&query%5BminPrice%5D=0&query%5BmaxPrice%5D=999999&page=${pageNr}&noCount=false`;
  return `${url}?${query}`;
};

const fetchNextPage = async (pageNr: number, allProducts: Array<any>) => {
  const response = await fetch(getUrlForPage(pageNr));
  const { products, totalProductCount } = await response.json();

  allProducts.push(...products);
  if (allProducts.length < totalProductCount && products.length > 0) {
    return await fetchNextPage(pageNr + 1, allProducts);
  }
  return allProducts;
};

const secondeditionrelease = new Date(Date.UTC(2018, 8, 1));
const secondeditionreleaseTimestamp = secondeditionrelease.getTime() / 1000;

export const scrapeWebhallen = async (storeConfig: StoreConfig) => {
  console.log(`Scraping Webhallen...`);
  const allProducts = await fetchNextPage(0, []);
  // console.log(`Found ${allProducts.length} X-Wing products for Webhallen`);

  // All second edition products were released after august 2018
  const SecondEdProducts = allProducts.filter(
    (d) => d.release.timestamp > secondeditionreleaseTimestamp
  );
  console.log(`Found ${SecondEdProducts.length} products for Webhallen`);

  const results: ScrapedItem[] = SecondEdProducts.map((p) => {
    const product: ScrapedItem = {
      name: filters.whitespace(filters.fixTitle(p.name)),
      price: filters.toNum(filters.price(p.price.price)),
      image: null,
      url: `https://www.webhallen.com/se/product/${p.id}`,
      stock: Object.entries(p.stock)
        .filter(
          ([name, _]) =>
            ["supplier", "displayCap", "orders"].indexOf(name) === -1
        )
        .reduce(
          (total: number, [_, stock]: [string, number]) => total + stock,
          0
        ),

      store: storeConfig.id,
    };
    return product;
  });

  const store: StoreWithScrapedItems = {
    ...storeConfig,
    items: results,
  };

  await jsonfile.writeFile(`${workspaceRoot}/data/webhallen.json`, store, {
    spaces: 2,
  });

  return store;
};
