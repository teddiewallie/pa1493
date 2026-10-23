// Diffs in the link below are ChatGPT assisted
// https://github.com/dipt-pa1493-ht26/pa1493-tewa25-lekh-zda/pull/181/changes

"use server";

import { auth } from "@/auth";
import { deleteGroupQuery } from "@/query/group-query";
import { setGroupArticlesAsUnsortedQuery } from "@/query/article-query";
import { setGroupItemsAsUnsortedQuery } from "@/query/item-query";

const deleteGroup = async (id) => {
  const session = await auth();

  if (!session || session.user.role_id > 1 || id == 1) {
    return false;
  }

  try {
    /*
     * Should make this atomic, but it's not a priority.
     * This will be an eternal TODO.
     */
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

