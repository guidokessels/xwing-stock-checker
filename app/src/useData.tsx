import { useState, useEffect } from "react";

export const useData = () => {
  const [data, setData] = useState<object | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    import(/* webpackChunkName: "data" */ "./data.json").then(
      (json: object) => {
        setData(json);
      },
      () => {
        setError("Could not load data");
      }
    );
  }, []);

  return { data, error };
};
