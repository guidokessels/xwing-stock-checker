export type StoreCode = "DL" | "AS" | "SFBOK" | "ESC" | "WOB";

export type StoreConfig = {
  name: string;
  id: StoreCode;
  url: string;
  openProductPage?: boolean;
  selectors?: Record<string, string>;
  file: string;
};

export type StoreWithScrapedItems = StoreConfig & { items: ScrapedItem[] };

export type Store = {
  name: string;
  id: StoreCode;
  url: string;
};

export type StoreItem = {
  price: number;
  stock: number | boolean;
  sku?: string;
  url: string;
  store: StoreCode;
};

export type ScrapedItem = StoreItem & {
  name: string;
  image: string;
};

export type Item = {
  stores: StoreItem[];
  name: string;
  image: string;
};
