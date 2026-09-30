"use client";

import { useEffect, useState } from "react";
import { getItems } from "@/service/get-items";
import { ItemsContext } from "@/context/items-context";

const ItemsProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshItems = async () => {
    setLoading(true);

    const items = await getItems();

    setItems(items);
    setLoading(false);
  };

  useEffect(() => {
    refreshItems();
  }, []);

  return (
    <ItemsContext.Provider value={{items, loading, refreshItems}}>
      { children }
    </ItemsContext.Provider>
  );
};

export { ItemsProvider, loading };

