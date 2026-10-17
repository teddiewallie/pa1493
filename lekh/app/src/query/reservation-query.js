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

const denyReservationsByUserIdQuery = async (userId) => pool.query(
  "DELETE FROM reservation WHERE user_id=?",
  [userId]
);

const setReturnedQuery = async (id) => {
  const returned_at = new Date();

  await pool.query(
    `UPDATE reservation
     SET returned_at=?, end_at=?
     WHERE id=?`,
    [returned_at, returned_at, id]
  );
};

export {
  addReservationQuery,
  getReservationsQuery,
  approveReservationQuery,
  denyReservationQuery,
  denyReservationsByUserIdQuery,
  setReturnedQuery
};

