"use server";

import { auth } from "@/auth";
import { setReturnedQuery } from "@/query/reservation-query";

const setReturned = async (id) => {
  const session = await auth();

  if (!session || session.user.role_id !== 1) {
    return false;
  }

  try {
    await setReturnedQuery(id);
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};

export { setReturned };
