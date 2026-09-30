"use server";

import { auth } from "@/auth";

import { getAllUsersQuery } from "@/query/user-query";

const getUsers = async () => {
  const session = await auth();

  const { roleId } = session?.user;

  if (!roleId || roleId != 1) {
    return false;
  }

  try {
    const users = await getAllUsersQuery();
    return users;
  } catch (e) {
    console.log(e);
    return false;
  }

  return false;
};

export { getUsers };

