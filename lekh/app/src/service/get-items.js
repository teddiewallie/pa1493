"use server";

import { auth } from "@/auth";
import { getItemsQuery } from "@/query/item-query";

const getItems = async () => {
  const session = await auth();

  if (!session) {
    return [];
  }

  try {
    const items = await getItemsQuery();
    return items;
  } catch(e) {
    return [];
  }
};

export { getItems };
