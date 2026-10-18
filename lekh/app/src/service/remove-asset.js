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

