import { useContext } from "react";
import { PendingCard } from "@/components/pending-card";
import { EquipmentContext } from "@/context/equipment-context";
import { ReservationsContext } from "@/context/reservations-context";
import { UsersContext } from "@/context/users-context";

const PendingsWrapper = () => {
  const { items } = useContext(EquipmentContext);
  const { reservations, refreshReservations } = useContext(ReservationsContext);
  const { users } = useContext(UsersContext);

  const pendings = reservations.filter((reservation) => reservation.is_pending);

  pendings.forEach((pending) => {
    pending.item = items.find((item) => (item.id == pending.item_id))
    pending.user = users.find((user) => (user.id == pending.user_id))
  });

  return (
    <>
      <div className="text-2xl font-bold md:col-span-2 lg:col-span-3">
        Pending Borrow Requests
      </div>
      { pendings.map(
        (pending) => <PendingCard key={`${pending.id}-${pending.item_id}`} {...{
          pending,
          item: pending.item,
          user: pending.user,
          refresh: refreshReservations
        }} />
      )}
    </>
  );
};

export { PendingsWrapper };
