import React from "react";
import data from "./data.json";
import "./App.css";

const App = () => {
  return (
    <>
      <h1>
        X-Wing Stock Checker
        <sup>⚡</sup>
      </h1>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Product</th>
            {Object.entries(data.stores).map(([key, store]) => (
              <th key={store.id}>
                {/* <a href={store.url} target="_blank" rel="noopener noreferrer"> */}
                {store.name}
                {/* </a> */}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.entries(data.itemsById)
            .sort(([keyA], [keyB]) => (keyA > keyB ? 1 : -1))
            .map(([key, items]) => (
              <tr key={key}>
                <td>
                  <a
                    href={items.find(d => d && d.image)!.image}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={items.find(d => d && d.image)!.image}
                      height="30"
                    />
                  </a>
                </td>
                <td>{items.find(d => d && d.name)!.name}</td>
                {Object.entries(data.stores).map(([key, store], i) => {
                  const item = items[i];

                  if (!item) {
                    return <td key={store.id}></td>;
                  }
                  return (
                    <td
                      key={item.store}
                      className={item.stock ? "in-stock" : "out-of-stock"}
                    >
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
                        {item.price} SEK
                      </a>
                    </td>
                  );
                })}
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
};

export default App;
