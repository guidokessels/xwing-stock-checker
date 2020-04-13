import React, { useState, useEffect } from "react";

export const Overview = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      import(/* webpackChunkName: "product-data" */ "./data.json").then(
        (json) => {
          setData(json);
        },
        () => {
          setError("Could not load data");
        }
      );
    }, 3500);
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  if (!data) {
    return <p>Loading...</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th className="column-image"></th>
          <th className="column-name">Product</th>
          <th className="column-stock">Stock</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(data.itemsById)
          .sort(([keyA], [keyB]) => (keyA > keyB ? 1 : -1))
          .map(([key, { name, image, stores = [] }]) => {
            const storesWithStock = stores
              .sort((a, b) => (a.price || 0) - (b.price || 0))
              .filter((i) => i.stock);
            const isInStock = storesWithStock.length > 0;
            const item = storesWithStock[0];
            return (
              <tr key={key}>
                <td className="column-image">
                  <a href={image} target="_blank" rel="noopener noreferrer">
                    <img
                      loading="lazy"
                      src={image}
                      alt={name}
                      title={name}
                      height="30"
                    />
                  </a>
                </td>
                <td className="column-name">
                  <a href={`#/product/${key}`}>{name}</a>
                </td>
                <td
                  className={
                    "column-stock " + (isInStock ? "in-stock" : "out-of-stock")
                  }
                >
                  {!isInStock ? "Out of stock" : `${item.price || `???`} kr`}
                </td>
              </tr>
            );
          })}
      </tbody>
    </table>
  );
};
