// https://nextjs.org/docs/app/getting-started/mutating-data

"use server";

import { createItemSchema } from "@/schema/item-schema";
import { reportSchema } from "@/schema/report-schema";
import { auth } from "@/auth";
import fs from "fs/promises";
import { getAssetPath } from "./asset-path";
import { getAsset } from "@/service/get-asset";
import { removeAsset } from "@/service/remove-asset";


import {
  addItemQuery,
  getItemStatusMetaQuery,
  updateItemQuery,
  addReportQuery
} from "@/query/item-query";

import { getGroups } from "./get-groups";

const addReport = async (data) => {
  const result = reportSchema.safeParse(data);
  const session = await auth();

  if (!result.success || !session) {
    return false;
  }

  try {
    await addReportQuery(data);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

const saveItem = async (data) => {
  const statuses = await getItemStatusMetaQuery();
  const { groups } = await getGroups();
  const schema = createItemSchema(groups, statuses, Boolean(data.id));
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

      if (oldAsset) {
        const oldAssetPath = getAssetPath(data.assetId, oldAsset.extension);
        await fs.unlink(oldAssetPath);
        await removeAsset(data.assetId);
      }
    }

    return asset;
  } catch (e) {
    console.log(e);
    return false;
  }

  return true;
};

export {
  addReport,
  saveItem
};

