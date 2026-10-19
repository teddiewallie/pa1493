"use server";

import { auth } from "@/auth";
import { reservationSchema } from "@/schema/reservation-schema";
import {
  addReservationQuery,
  approveReservationQuery,
  denyReservationQuery,
} from "@/query/reservation-query";

const addReservation = async (reservation) => {
  const session = await auth();

  if (!session || reservation.id) return false;

  const result = await reservationSchema.safeParse(reservation);

  if (!result.success) return false;

  try {
    await addReservationQuery(reservation, session.user.id);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

const approveReservation = async (reservationId) => {
  return await reservationResponse(reservationId, true);
};

const denyReservation = async (reservationId) => {
  return await reservationResponse(reservationId, false);
};

const reservationResponse = async (reservationId, isApproved) => {
  const session = await auth();

  if (!session || session.user.role_id !== 1) return false;

  try {
    if (isApproved) {
      await approveReservationQuery(reservationId);
    } else {
      await denyReservationQuery(reservationId);
    }

    return true;
  } catch (e) {
    return false;
  }
};

export { addReservation, approveReservation, denyReservation };

