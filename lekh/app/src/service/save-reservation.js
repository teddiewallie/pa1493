
"use server";

import { auth } from "@/auth";
import { reservationSchema } from "@/schema/reservation-schema";
import { addReservationQuery } from "@/query/reservation-query";

const addReservation = async (reservation) => {
  const session = await auth();
  const { user } = session;
  const result = await reservationSchema.safeParse(reservation);

  if (!result.success || !session || reservation.id) {
    return false;
  }

  try {
    addReservationQuery(reservation, user.id);
  } catch (e) {
    console.log(e);
    return false;
  }

  return true; 
};

export { addReservation };

