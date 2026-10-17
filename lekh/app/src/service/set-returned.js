"use server";

import { auth } from "@/auth";
import { setReturnedQuery } from "@/query/reservation-query";

const setReturned = async (id) => {
  const { session } = await auth();
  const { user } = session;

  if (!session || user.role_id !== 1) {
    return false;
  }

  try {
    await setReturnedQuery(id);
    return true;
  } catch (e) {
    return false;
    console.log(e);
  }
};

export { setReturned };
