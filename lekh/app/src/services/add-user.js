// https://nextjs.org/docs/app/getting-started/mutating-data

"use server";

import schema from "@/schema/user-schema.js";

import { addUserQuery } from "@/query/user.js";

const addUser = async (data) => {
  const result = schema.safeParse(data);

  if (!result.success) {
    return false;
  }

  try {
    await addUserQuery(data);
  } catch (e) {
    return false;
  }

  return true;
};

export { addUser };

