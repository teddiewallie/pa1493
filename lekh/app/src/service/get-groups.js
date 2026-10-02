"use server";

import { auth } from "@/auth";
import { getGroupsQuery } from "@/query/group-query";

const getGroups = async () => {
  const session = await auth();

  if (!session) {
    return [];
  }

  try {
    const capsule = {};
    capsule.groups = await getGroupsQuery();
    return capsule;
  } catch(e) {
    return [];
  }
};

export { getGroups };
