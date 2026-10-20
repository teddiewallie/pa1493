import { useContext } from "react";
import { CreateBookForm } from "@/components/create-book-form";
import { CreateBorrowForm } from "@/components/create-borrow-form";
import { ReservationsContext } from "@/context/reservations-context";
import { addReservation } from "@/service/save-reservation";
import { toast } from "@/components/ui/toast";
import {
  eachDayOfInterval,
  format,
  getHours,
  isSameDay,
  isToday,
} from "date-fns";

const CreateReservation = ({ item }) => {
  const { reservations, refreshReservations } =
    useContext(ReservationsContext);

  const itemReservations = reservations.filter(
    (reservation) => reservation.item_id == item.id
  );

  const activeReservations = itemReservations.filter(
    (reservation) => reservation.returned_at == null
  );

  // Reservations with a midnight start are full-day borrowings.
  const borrowingReservations = activeReservations.filter(
    (reservation) => getHours(new Date(reservation.start_at)) === 0
  );

  // Reservations with a non-midnight start are time-slot bookings.
  const bookingReservations = activeReservations.filter(
    (reservation) => getHours(new Date(reservation.start_at)) !== 0
  );

  // Every day occupied by a borrowing, including its return day.
  const borrowings = borrowingReservations.flatMap((reservation) =>
    eachDayOfInterval({
      start: new Date(reservation.start_at),
      end: new Date(reservation.end_at),
    })
  );

  // Dates occupied by bookings, regardless of the item's current settings.
  const bookingDates = bookingReservations.map(
    (reservation) => new Date(reservation.start_at)
  );

  // The booking form displays time slots for today.
  const bookings = bookingReservations
    .filter((reservation) => isSameDay(new Date(reservation.start_at), new Date()))
    .map(
      (reservation) =>
        `${format(new Date(reservation.start_at), "HH:mm")}-${format(
          new Date(reservation.end_at),
          "HH:mm"
        )}`
    );

  const callback = async (reservation) => {
    reservation.itemId = item.id;
    reservation.isPending = Boolean(item.borrowable);

    const isSuccess = await addReservation(reservation);

    if (isSuccess) {
      const title =
        reservation.reservationType === "borrow"
          ? "Borrow request sent."
          : "Unit booked.";

      toast.add({ title });
      refreshReservations();
    } else {
      const title =
        reservation.reservationType === "borrow"
          ? "Couldn't send borrow request."
          : "Unit could not be booked.";

      toast.add({ title });
    }
  };

  if (item.bookable) {
    return (
      <CreateBookForm
        item={item}
        callback={callback}
        bookings={bookings}
        borrowings={borrowings}
      />
    );
  }

  if (item.borrowable) {
    return (
      <CreateBorrowForm
        item={item}
        callback={callback}
        bookings={bookingDates}
        borrowings={borrowings}
      />
    );
  }

  return <div />;
};

export { CreateReservation };
