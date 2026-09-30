"use server";

import { auth } from "@/auth";
import { getItemsQuery, getItemStatusMetaQuery } from "@/query/item-query";

const getItems = async () => {
  const session = await auth();

  if (!session) {
    return [];
  }

  try {
    const capsule = {};
    capsule.items = await getItemsQuery();

    capsule.meta = {};
    capsule.meta.status = await getItemStatusMetaQuery();

    return capsule;
  } catch(e) {
    return [];
  }
};

export { getItems };
