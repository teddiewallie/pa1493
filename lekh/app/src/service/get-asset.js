"use server";

import { auth } from "@/auth";
import { getAssetQuery } from "@/query/asset-query";

const getAsset = async (id) => {
  const session = auth();

  if (!session) {
    throw new Error();
  }

  const result = await getAssetQuery(id);

  return result;
};


export { getAsset };
