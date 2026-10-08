import pool from "@/lib/db";

const addReservationQuery = async (reservation, userId) => {
  await pool.query(
    "INSERT INTO reservation (start_at, end_at, user_id, item_id, is_pending) VALUES (?, ?, ?, ?, ?)",
    [reservation.startAt, reservation.endAt, userId, reservation.itemId, reservation.isPending]
  );
};

const getReservationsQuery = async () => await pool.query("SELECT * FROM reservation");

const approveReservationQuery = async (reservationId) => {
  await pool.query(
    "UPDATE reservation SET is_pending=? WHERE id=?",
    [0, reservationId]
  );
};

const denyReservationQuery = async (reservationId) => {
  await pool.query(
    "DELETE FROM reservation WHERE id=?",
    [reservationId]
  );
};

export {
  addReservationQuery,
  getReservationsQuery,
  approveReservationQuery,
  denyReservationQuery
};

