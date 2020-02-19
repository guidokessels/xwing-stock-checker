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
      <div className="update-notice">
        Updated every 15 minutes.
        <br />
        Last update: {new Date(data.timestamp).toLocaleString("sv")}
      </div>
      <table>
        <thead>
          <tr>
            <th className="column-image"></th>
            <th className="column-name">Product</th>
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
            .map(([key, items = {}]) => {
              const itemWithNameAndImage = Object.values(items).find(
                p => p!.name && p!.image
              );
              return (
                <tr key={key}>
                  <td className="column-image">
                    <a
                      href={itemWithNameAndImage!.image}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img src={itemWithNameAndImage!.image} height="30" />
                    </a>
                  </td>
                  <td className="column-name">{itemWithNameAndImage!.name}</td>
                  {Object.entries(data.stores).map(([key, store], i) => {
                    // @ts-ignore
                    const item = items[store.id];

                    if (!item) {
                      return <td key={store.id} className="column-stock"></td>;
                    }
                    return (
                      <td
                        key={item.store}
                        className={`column-stock ${
                          item.stock ? "in-stock" : "out-of-stock"
                        }`}
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
              );
            })}
        </tbody>
      </table>
    </>
  );
};

export default App;
