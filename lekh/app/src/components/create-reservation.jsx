import { useContext } from "react";
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
  format,
} from "date-fns";

const CreateReservation = ({ item }) => {
  const { reservations, refreshReservations } = useContext(ReservationsContext);

  const itemReservations = reservations.filter(
    (reservation) => reservation.item_id == item.id
  );

  const bookings = item.bookable
    ? itemReservations
        .filter(
          (reservation) =>
            isSameDay(reservation.start_at, reservation.end_at)
            && reservation.returned_at == null
            && getHours(reservation.start_at) !== 0
            && isToday(reservation.start_at)
        )
        .map((reservation) =>
          `${format(reservation.start_at, "HH:mm")}-${format(
            reservation.end_at,
            "HH:mm"
          )}`
        )
    : [];

  const borrowings = item.borrowable
    ? itemReservations
        .filter(
          (reservation) =>
            reservation.returned_at == null
            && getHours(reservation.start_at) === 0
        )
        .flatMap((reservation) =>
          eachDayOfInterval({
            start: reservation.start_at,
            end: reservation.end_at,
          })
        )
    : [];

  const callback = async (reservation) => {
    reservation.itemId = item.id;
    reservation.isPending = Boolean(item.borrowable);

    const isSuccess = await addReservation(reservation);

    if (isSuccess) {
      const title = item.borrowable
        ? "Borrow request sent."
        : item.bookable
          ? "Unit booked."
          : "Type not recognized";

      toast.add({ title });
      refreshReservations();
    } else {
      const title = item.borrowable
        ? "Couldn't send borrow request."
        : item.bookable
          ? "Unit could not be booked."
          : "Type not recognized";

      toast.add({ title });
    }
  };

  if (item.bookable) {
    return <CreateBookForm {...{ item, callback, bookings }} />;
  }

  if (item.borrowable) {
    return <CreateBorrowForm {...{ item, callback, borrowings }} />;
  }

  return <div />;
};

export { CreateReservation };

