// https://nextjs.org/docs/app/getting-started/mutating-data

"use server";

import schema from "@/schema/user-schema.js";

const saveUser = async (data) => {
  const result = schema.safeParse(data);

  if (!result.success) {
    return false;
  }

  console.log(data);

  return true;
};

export { saveUser };

