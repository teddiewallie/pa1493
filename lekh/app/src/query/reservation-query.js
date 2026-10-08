import pool from "@/lib/db";

const addReservationQuery = async (reservation, userId) => {
  await pool.query(
    "INSERT INTO reservation (start_at, end_at, user_id, item_id, is_pending) VALUES (?, ?, ?, ?, ?)",
    [reservation.startAt, reservation.endAt, userId, reservation.itemId, reservation.isPending]
  );
};

const getReservationsQuery = async () => await pool.query("SELECT * FROM reservation");

export { addReservationQuery, getReservationsQuery };

