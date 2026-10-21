"use server";

import { auth } from "@/auth";
import { reservationSchema } from "@/schema/reservation-schema";
import {
  addReservationQuery,
  getReservationsQuery,
  approveReservationQuery,
  denyReservationQuery,
} from "@/query/reservation-query";

const getStockholmDateKey = (date) => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Stockholm",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const values = Object.fromEntries(
    parts.map(({ type, value }) => [type, value])
  );

  return `${values.year}-${values.month}-${values.day}`;
};

const addReservation = async (reservation) => {
  const session = await auth();

  if (!session?.user || reservation?.id) return false;

  const result = reservationSchema.safeParse(reservation);

  if (!result.success) return false;

  const data = result.data;
  const userId = Number(session.user.id);

  if (!Number.isInteger(userId) || userId <= 0) return false;

  try {
    if (data.reservationType === "borrow") {
      // Borrow requests use calendar dates, not timestamps.
      const startDate = getStockholmDateKey(data.startAt);
      const today = getStockholmDateKey(new Date());

      if (startDate < today) return false;
    } else {
      // Bookings must start in the future.
      if (data.startAt <= new Date()) return false;
    }

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
        isPending: data.reservationType === "borrow",
      },
      userId,
    );

    return true;
  } catch (e) {
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

