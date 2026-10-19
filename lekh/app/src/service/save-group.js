// https://nextjs.org/docs/app/getting-started/mutating-data

"use server";

import { createGroupSchema } from "@/schema/group-schema";
import { auth } from "@/auth";

import {
  addGroupQuery,
  updateGroupQuery
} from "@/query/group-query";

const saveGroup = async (data) => {
  const schema = createGroupSchema();
  const result = schema.safeParse(data);

  const session = await auth();

  if (!result.success || session?.user?.role_id !== 1) {
    return false;
  }

  const groupData = {
    ...data,
    userId: session.user.id
  };

  try {
    let group = null;

    if (data.id) {
      group = await updateGroupQuery(groupData);
    } else {
      group = await addGroupQuery(groupData);
    }

    return group;
  } catch (e) {
    return false;
  }
};

export { saveGroup };

