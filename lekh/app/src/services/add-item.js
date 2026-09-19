// https://nextjs.org/docs/app/getting-started/mutating-data

"use server";

import schema from "@/schema/item-schema.js";
import { auth } from "@/auth";

import { addItemQuery } from "@/query/item-query.js";

const addItem = async (data) => {
  const result = schema.safeParse(data);
  const session = await auth();

  if (!result.success) {
    return false;
  }

  data.userId = session.user.id;

  try {
    await addItemQuery(data);
  } catch (e) {
    return false;
  }

  return true;
};

export { addItem };

