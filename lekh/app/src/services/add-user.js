// https://nextjs.org/docs/app/getting-started/mutating-data

"use server";

import schema from "@/schema/user-schema.js";
import { auth } from "@/auth";

import { addUserQuery } from "@/query/user-query.js";

const addUser = async (data) => {
  const result = schema.safeParse(data);
  const session = await auth();

  if (!result.success || session.user.roleId > 1) {
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

