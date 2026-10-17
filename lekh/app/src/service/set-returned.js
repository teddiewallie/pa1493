"use server";

import { setReturnedQuery } from "@/query/reservation-query";

const setReturned = async (id) => {
  try {
    setReturnedQuery(id);
    return true;
  } catch (e) {
    return false;
    console.log(e);
  }
};

export { setReturned };
