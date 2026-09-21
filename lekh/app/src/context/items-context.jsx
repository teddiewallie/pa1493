"use client";

import { getAllItems } from "@/query/item-query";
import { createContext } from "react";

let ItemsContext = createContext([]);

//try {
//  ItemsContext = createContext(await getAllItems());
//} catch (e) {
//  createContext([]);
//}

export { ItemsContext };

