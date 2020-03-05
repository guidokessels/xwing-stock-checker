import React from "react";
import data from "./data.json";

export const Product = props => {
  const {
    route: {
      params: { id }
    }
  } = props;

  const items = data.itemsById[id] || [];

  const BackToOverview = (
    <a className="backToOverview" href="#/">
      Back to Overview
    </a>
  );

  if (!items.length) {
    return (
      <>
        {BackToOverview}
        <div>Could not find product</div>
      </>
    );
  }

  const { name, image } = items.find(p => p.name && p.image);
  const sortedByPriceAndStock = items.sort((a, b) => {
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
      <div className="product-image">
        <img src={image} title={name} />
      </div>
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
          {sortedByPriceAndStock.map(item => {
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
                <td>{item.price || "???"} SEK</td>
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
