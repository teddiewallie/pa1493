"use server";

import { auth } from "@/auth";

import { getAllUsersQuery } from "@/query/user-query";

const getUsers = async () => {
  const session = await auth();

  const { role_id } = session?.user ?? {};

  if (!role_id || role_id != 1) {
    return [];
  }

  try {
    const users = await getAllUsersQuery();
    return users;
  } catch (e) {
    console.log(e);
    return [];
  }
};

export { getUsers };

