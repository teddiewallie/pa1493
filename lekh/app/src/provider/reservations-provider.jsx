"use client";

import { useEffect, useState } from "react";
import { getReservations } from "@/service/get-reservations";
import { ReservationsContext } from "@/context/reservations-context";

const ReservationsProvider = ({ children }) => {
  const [ reservations, setReservations] = useState([]);

  const [ loading, setLoading ] = useState(true);

  const refreshReservations = async () => {
    setLoading(true);

    const newReservations = await getReservations();

    setReservations(newReservations);
    setLoading(false);
  };

  useEffect(() => {
    refreshReservations()
  }, []);

  return (
    <ReservationsContext.Provider value={{reservations, refreshReservations, loading}}>
      { children }
    </ReservationsContext.Provider>
  );
};

export { ReservationsProvider, loading };

