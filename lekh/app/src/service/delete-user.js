"use server";

import { auth } from "@/auth";
import { deleteUserQuery } from "@/query/user-query.js";
import { denyReservationsByUserIdQuery } from "@/query/reservation-query";

const deleteUser = async (id) => {
  const session = await auth();
  
  if (!session || session.user.role_id > 1) {
    return false;
  }

  try {
    /*
     * Yeaaa should really make this atomic.
     * Not the priority right now though.
     * Gonna leave it as an undone TODO.
     */
    await denyReservationsByUserIdQuery(id);
    await deleteUserQuery(id);
  } catch (e) {
    console.log(e);
    return false;
  }

  return true;
};

export { deleteUser };

