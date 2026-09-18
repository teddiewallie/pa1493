// https://nextjs.org/docs/app/getting-started/mutating-data

"use server";

import schema from "@/schema/user-schema.js";

const saveUser = async (data) => {
  const result = schema.safeParse(data);

  if (!result.success) {
    return false;
  }

  return true;
};

export { saveUser };

