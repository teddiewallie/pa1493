"use server";

import { auth } from "@/auth";

import { getReservationsQuery } from "@/query/reservation-query";

const getReservations = async () => {
  const session = await auth();

  if (!session) {
    return [];
  }

  try {
    const reservations = await getReservationsQuery();
    return reservations;
  } catch (e) {
    console.log(e);
    return [];
  }
};

export { getReservations };

