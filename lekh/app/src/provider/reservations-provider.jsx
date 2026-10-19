"use client";

import { useEffect, useState } from "react";
import { getReservations } from "@/service/get-reservations";
import { ReservationsContext } from "@/context/reservations-context";

const ReservationsProvider = ({ children }) => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshReservations = async () => {
    setLoading(true);

    try {
      const newReservations = await getReservations();
      setReservations(newReservations);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const newReservations = await getReservations();
        setReservations(newReservations);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  return (
    <ReservationsContext.Provider
      value={{ reservations, refreshReservations, loading }}
    >
      {children}
    </ReservationsContext.Provider>
  );
};

export { ReservationsProvider };

