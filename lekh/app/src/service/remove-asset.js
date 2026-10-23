// Diffs in the link below are ChatGPT assisted
// https://github.com/dipt-pa1493-ht26/pa1493-tewa25-lekh-zda/pull/181/changes

import { auth } from "@/auth";
import { removeAssetQuery } from "@/query/asset-query";

const removeAsset = async (id) => {
  const session = await auth();

  if (!session) {
    throw new Error();
  }

  await removeAssetQuery(id);
};

export { removeAsset };

