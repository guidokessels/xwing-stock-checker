import React from "react";
import { RouterView, Route, RouteFallback } from "peppermint-router";

// Pages
import { Overview } from "./Overview";
import { Product } from "./Product";

export const Routes = () => {
  return (
    <RouterView>
      <Route path="#/" component={Overview} />
      <Route path="#/product/:id" component={Product} />
      <RouteFallback component={Overview} />
    </RouterView>
  );
};
