import { useContext, useEffect, useState } from "react";
import { CreateBookForm } from "@/components/create-book-form";
import { CreateBorrowForm } from "@/components/create-borrow-form";
import { ReservationsContext } from "@/context/reservations-context";
import { addReservation } from "@/service/save-reservation";
import { toast } from "@/components/ui/toast";
import {
  eachDayOfInterval,
  isSameDay,
  isToday,
  getHours,
  format
} from "date-fns";

const CreateReservation = ({ item }) => {
  const [message, setMessage] = useState("");
  useEffect(() => {
    if (message === "") {
      return;
    }

    toast.add({ title: message });
    setMessage("");
  }, [message]);

  const [bookings, setBookings] = useState([]);
  const [borrowings, setBorrowings] = useState([]);
  const { reservations, refreshReservations } = useContext(ReservationsContext);
  useEffect(() => {
    const itemReservations = reservations
      .filter((reservation) => (reservation.item_id == item.id));

    if (item.bookable) {
      setBookings(itemReservations.filter((reservation) => (
        isSameDay(reservation.start_at, reservation.end_at)
        && getHours(reservation.start_at) !== 0
        && isToday(reservation.start_at)
      )).map((r) => (`${format(r.start_at, "HH:mm")}-${format(r.end_at, "HH:mm")}`)));
    }

    if (item.borrowable) {
      setBorrowings(itemReservations.filter((reservation) => (
        getHours(reservation.start_at) === 0
      )).flatMap((reservation) => eachDayOfInterval({
        start: reservation.start_at,
        end: reservation.end_at
      })));
    }
  }, [reservations, item]);

  const callback = async (reservation) => {
    reservation.itemId = item.id;
    reservation.isPending = Boolean(item.borrowable);

    const isSuccess = await addReservation(reservation);

    if (isSuccess) {
      const title = item.borrowable ? "Borrow request sent."
        : item.bookable ? "Unit booked."
        : "Type not recognized";

      setMessage(title);
      refreshReservations();
    } else {
      const title = item.borrowable ? "Couldn't send borrow request."
        : item.bookable ? "Unit could not be booked."
        : "Type not recognized";

      setMessage(title);
    }
  };

  const Element = () => {
    if (item.bookable) {
      return (<CreateBookForm {...{ item, callback, bookings }} />);
    } else if (item.borrowable) {
      return (<CreateBorrowForm {...{ item, callback, borrowings }} />);
    } else {
      return (<div />);
    }
  };

  return (
    <Element />
  );
};

export { CreateReservation };

