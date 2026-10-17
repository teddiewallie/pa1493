"use server";

import { auth } from "@/auth";
import { deleteGroupQuery } from "@/query/group-query";
import { setGroupArticlesAsUnsortedQuery } from "@/query/article-query";
import { setGroupItemsAsUnsortedQuery } from "@/query/item-query";

const deleteGroup = async (id) => {
  const session = await auth();

  if (!session && session.user.role_id > 1) {
    return false;
  }

  try {
    await setGroupArticlesAsUnsortedQuery(id);
    await setGroupItemsAsUnsortedQuery(id);
    await deleteGroupQuery(id);
  } catch (e) {
    console.log(e);
    return false;
  }

  return true;
};

export { deleteGroup };

