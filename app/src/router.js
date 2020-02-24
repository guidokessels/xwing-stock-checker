import React from "react";
import { useRoutes } from "hookrouter";

// Pages
import { Overview } from "./Overview";
import { Product } from "./Product";

// Routes config
const routes = {
  "/": () => <Overview />,
  "/product/:id": ({ id }) => <Product id={id} />
};

export const Router = () => {
  const routeResult = useRoutes(routes);

  return routeResult || <Overview />;
};
