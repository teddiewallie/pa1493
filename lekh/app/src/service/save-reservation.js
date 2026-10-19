"use server";

import { auth } from "@/auth";
import { reservationSchema } from "@/schema/reservation-schema";
import {
  addReservationQuery,
  getReservationsQuery,
  approveReservationQuery,
  denyReservationQuery,
} from "@/query/reservation-query";

const addReservation = async (reservation) => {
  const session = await auth();

  if (!session?.user || reservation?.id) return false;

  const result = reservationSchema.safeParse(reservation);

  if (!result.success) return false;

  const data = result.data;
  const userId = Number(session.user.id);

  if (!Number.isInteger(userId) || userId <= 0) return false;

  try {
    // Reject reservations that start in the past.
    if (data.startAt <= new Date()) return false;

    // Check for overlapping reservations on this item.
    const reservations = await getReservationsQuery();

    const hasConflict = reservations.some((existing) => {
      if (Number(existing.item_id) !== data.itemId) return false;
      if (existing.returned_at != null) return false;

      const existingStart = new Date(existing.start_at);
      const existingEnd = new Date(existing.end_at);

      return (
        existingStart < data.endAt &&
        existingEnd > data.startAt
      );
    });

    if (hasConflict) return false;

    // Approval status is controlled by the server.
    await addReservationQuery(
      {
        ...data,
        isPending: true,
      },
      userId,
    );

    return true;
  } catch (e) {
    console.error(e);
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

  if (!session?.user || session.user.role_id !== 1) {
    return false;
  }

  if (!Number.isInteger(reservationId) || reservationId <= 0) {
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
    console.error(e);
    return false;
  }
};

export { addReservation, approveReservation, denyReservation };

