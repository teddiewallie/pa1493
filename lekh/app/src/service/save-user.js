// https://nextjs.org/docs/app/getting-started/mutating-data

"use server";

import { createUserSchema } from "@/schema/user-schema.js";
import { auth } from "@/auth";

import {
  addUserQuery,
  updateUserQuery
} from "@/query/user-query.js";

const saveUser = async (data) => {
  const editing = Boolean(data.id);
  const schema = createUserSchema(editing);
  const result = schema.safeParse(data);
  const session = await auth();

  if (!result.success || !session) {
    return false;
  }

  
  if (session.user.id !== data.id && session.user.role_id > 1) {
    return false;
  }

  try {
    let result = false;
    if (data.id) {
      await updateUserQuery(data, session.user.role_id == 1);
    } else {
      await addUserQuery(data);
    }
  } catch (e) {
    return false;
  }

  return true;
};

export { saveUser };

