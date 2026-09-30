// https://nextjs.org/docs/app/getting-started/mutating-data

"use server";

import { createItemSchema } from "@/schema/item-schema";
import { auth } from "@/auth";
import fs from "fs/promises";
import { getAssetPath } from "./asset-path";

import { addItemQuery, getItemStatusMetaQuery } from "@/query/item-query";

const addItem = async (data) => {
  const statuses = await getItemStatusMetaQuery();
  const schema = createItemSchema(statuses);
  const result = schema.safeParse(data);

  const session = await auth();

  if (!result.success || !session) {
    return false;
  }

  const itemData = {
    ...data,
    userId: session.user.id
  };

  try {
    const asset = await addItemQuery(itemData);
    const assetPath = getAssetPath(asset.id, asset.extension);

    await fs.writeFile(assetPath, Buffer.from(await data.image.arrayBuffer()));
  } catch (e) {
    console.log(e);
    return false;
  }

  return true;
};

export { addItem };

