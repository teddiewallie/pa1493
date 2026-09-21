"use client";

import { ItemsContext } from "@/context/items-context";

const ItemsProvider = ({ items, children }) => (
  <ItemsContext.Provider value={items}>
    { children }
  </ItemsContext.Provider>
);

export { ItemsProvider };

