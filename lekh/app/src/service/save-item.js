// https://nextjs.org/docs/app/getting-started/mutating-data

"use server";

import { createItemSchema } from "@/schema/item-schema";
import { auth } from "@/auth";
import fs from "fs/promises";
import { getAssetPath } from "./asset-path";
import { getAsset } from "@/service/get-asset";
import { removeAsset } from "@/service/remove-asset";


import {
  addItemQuery,
  getItemStatusMetaQuery,
  updateItemQuery
} from "@/query/item-query";

const saveItem = async (data) => {
  const statuses = await getItemStatusMetaQuery();
  const schema = createItemSchema(statuses, Boolean(data.id));
  const result = schema.safeParse(data);

  const session = await auth();

  if (!result.success || !session || session.user.role_id !== 1) {
    return false;
  }

  const itemData = {
    ...data,
    userId: session.user.id
  };

  try {
    let asset = null;

    if (data.id) {
      asset = await updateItemQuery(itemData);
    } else {
      asset = await addItemQuery(itemData);
    }

    if (asset.id && asset.extension) {
      const assetPath = getAssetPath(asset.id, asset.extension);
      await fs.writeFile(assetPath, Buffer.from(await data.image.arrayBuffer()));

      const oldAsset = await getAsset(data.assetId);
      const oldAssetPath = getAssetPath(data.assetId, oldAsset.extension);
      await fs.unlink(oldAssetPath);
      await removeAsset(data.assetId);
    }

    return asset;
  } catch (e) {
    return false;
  }

  return true;
};

export { saveItem };

