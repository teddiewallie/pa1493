// Diffs in the link below are ChatGPT assisted
// https://github.com/dipt-pa1493-ht26/pa1493-tewa25-lekh-zda/pull/181/changes

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
    console.log(e);
    return false;
  }
};

export { setReturned };

