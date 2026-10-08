
"use server";

import { auth } from "@/auth";
import { reservationSchema } from "@/schema/reservation-schema";
import {
  addReservationQuery,
  approveReservationQuery,
  denyReservationQuery
} from "@/query/reservation-query";

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

const approveReservation = async (reservationId) => {
  const result = await reservationResponse(reservationId, true);
  return result;
};

const denyReservation = async (reservationId) => {
  const result = await reservationResponse(reservationId, false);
  return result;
};

const reservationResponse = async (reservationId, isApproved) => {
  const session = await auth();
  const { user } = session;

  if (!session || user.role_id !== 1) {
    return false;
  }

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

export {
  addReservation,
  approveReservation,
  denyReservation
};

