"use client";

import { useEffect, useState } from "react";
import { getItems } from "@/service/get-items";
import { ItemsContext } from "@/context/items-context";

const ItemsProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  const refreshItems = async () => {
    const items = await getItems();
    setItems(items);
  };

  useEffect(() => {
    refreshItems();
  }, []);

  return (
    <ItemsContext.Provider value={{items, refreshItems}}>
      { children }
    </ItemsContext.Provider>
  );
};

export { ItemsProvider };

