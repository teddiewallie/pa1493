// https://nextjs.org/docs/app/getting-started/mutating-data

"use server";

import schema from "@/schema/item-schema.js";
import { auth } from "@/auth";
import fs from "fs/promises";
import path from "path";

import { addItemQuery } from "@/query/item-query.js";

const addItem = async (data) => {
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

    const filePath = path.join(
      process.cwd(),
      "..",
      "assets",
      `${asset.id}.${asset.extension}`
    );

    await fs.writeFile(filePath, Buffer.from(await data.image.arrayBuffer()));
  } catch (e) {
    return false;
  }

  return true;
};

export { addItem };

