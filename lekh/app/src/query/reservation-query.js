// Diffs in the link below are ChatGPT assisted
// https://github.com/dipt-pa1493-ht26/pa1493-tewa25-lekh-zda/pull/181/changes

import pool from "@/lib/db";

const isValidId = (id) => id > 0;

const addReservationQuery = async (reservation, userId) => {
  if (!isValidId(userId) || !isValidId(reservation.itemId)) {
    throw new Error("Invalid user or item ID");
  }

  if (
    !(reservation.startAt instanceof Date) ||
    !(reservation.endAt instanceof Date) ||
    Number.isNaN(reservation.startAt.getTime()) ||
    Number.isNaN(reservation.endAt.getTime()) ||
    reservation.endAt <= reservation.startAt
  ) {
    throw new Error("Invalid reservation dates");
  }

  const result = await pool.query(
    `INSERT INTO reservation
      (start_at, end_at, user_id, item_id, is_pending)
     VALUES (?, ?, ?, ?, ?)`,
    [
      reservation.startAt,
      reservation.endAt,
      userId,
      reservation.itemId,
      reservation.isPending,
    ]
  );

  return { id: result.insertId };
};

const getReservationsQuery = async () => {
  return await pool.query("SELECT * FROM reservation");
};

const approveReservationQuery = async (reservationId) => {
  if (!isValidId(reservationId)) {
    throw new Error("Invalid reservation ID");
  }

  const result = await pool.query(
    `UPDATE reservation
     SET is_pending = 0
     WHERE id = ? AND is_pending = 1`,
    [reservationId]
  );

  if (result.affectedRows === 0) {
    throw new Error("Reservation not found or already processed");
  }

  return true;
};

const denyReservationQuery = async (reservationId) => {
  if (!isValidId(reservationId)) {
    throw new Error("Invalid reservation ID");
  }

  const result = await pool.query(
    "DELETE FROM reservation WHERE id = ? AND is_pending = 1",
    [reservationId]
  );

  if (result.affectedRows === 0) {
    throw new Error("Pending reservation not found");
  }

  return true;
};

const denyReservationsByUserIdQuery = async (userId) => {
  console.log(userId);
  if (!isValidId(userId)) {
    throw new Error("Invalid ID.");
  }

  return await pool.query(
    "DELETE FROM reservation WHERE user_id = ?",
    [userId]
  );
};

const setReturnedQuery = async (id) => {
  if (!isValidId(id)) {
    throw new Error("Invalid ID.");
  }

  const returnedAt = new Date();

  const result = await pool.query(
    `UPDATE reservation
     SET returned_at = ?, end_at = ?
     WHERE id = ?
       AND returned_at IS NULL
       AND is_pending = 0`,
    [returnedAt, returnedAt, id]
  );

  if (result.affectedRows === 0) {
    throw new Error("Reservation not found, pending, or already returned");
  }

  return true;
};

export {
  addReservationQuery,
  getReservationsQuery,
  approveReservationQuery,
  denyReservationQuery,
  denyReservationsByUserIdQuery,
  setReturnedQuery,
};

