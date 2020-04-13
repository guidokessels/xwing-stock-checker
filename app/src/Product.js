import React from "react";
import { useData } from "./useData";

export const Product = (props) => {
  const {
    route: {
      params: { id },
    },
  } = props;

  const { data, error } = useData();

  if (error) {
    return <p>{error}</p>;
  }

  if (!data) {
    return <p>Loading...</p>;
  }

  const { name, image, stores = [] } = data.itemsById[id] || {};

  const BackToOverview = (
    <a className="backToOverview" href="#/">
      &laquo; Back to Overview
    </a>
  );

  if (!stores.length || !name) {
    return (
      <>
        {BackToOverview}
        <p>Could not find product</p>
      </>
    );
  }

  const sortedByPriceAndStock = stores.sort((a, b) => {
    if (a.stock && b.stock && a.price !== b.price) {
      return a.price - b.price;
    } else if (a.stock !== b.stock) {
      return b.stock - a.stock;
    }
    return 0;
  });

  return (
    <div>
      {BackToOverview}
      {image && (
        <div className="product-image">
          <img src={image} alt={name} title={name} loading="lazy" />
        </div>
      )}
      <h2 className="product-name">{name}</h2>
      <table>
        <thead>
          <tr>
            <th>Store</th>
            <th>Stock</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {sortedByPriceAndStock.map((item) => {
            const store = data.stores[item.store];
            return (
              <tr key={store.id}>
                <td>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={
                      `In Stock: ` +
                      (typeof item.stock === "number"
                        ? item.stock
                        : item.stock
                        ? "Yes"
                        : "No")
                    }
                  >
                    {store.name}
                  </a>
                </td>
                <td
                  className={
                    "column-stock " + (item.stock ? "in-stock" : "out-of-stock")
                  }
                >
                  {item.stock
                    ? typeof item.stock === "number"
                      ? item.stock
                      : "Yes"
                    : 0}
                </td>
                <td>{item.price || "???"} kr</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <br />
      {BackToOverview}
    </div>
  );
};
