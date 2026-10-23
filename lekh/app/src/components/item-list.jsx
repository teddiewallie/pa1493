// Diffs in the link below are ChatGPT assisted
// https://github.com/dipt-pa1493-ht26/pa1493-tewa25-lekh-zda/pull/181/changes

"use client";

import { useContext } from "react";
import { UserContext } from "@/context/user-context";
import { EquipmentContext } from "@/context/equipment-context";
import { ReservationsContext } from "@/context/reservations-context";
import { ModalWithToast } from "@/components/modal-with-toast";
import { CreateItemForm } from "@/components/create-item-form";
import { ItemCard } from "@/components/item-card";
import { toast } from "@/components/ui/toast";

const ItemList = ({ extraCards, groupId, children }) => {
  const { items, refreshItems, meta } = useContext(EquipmentContext);
  const { user } = useContext(UserContext);
  const { reservations } = useContext(ReservationsContext);

  const curatedItems = groupId
    ? items.filter((item) => item.group_id == groupId)
    : items;

  return (
    <div className="container md:mx-auto">
      <div className="container grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6 md:mx-auto px-10 mt-2">
        {children}

        {user.role_id == 1 && (
          <ModalWithToast title="Add Unit" row>
            <CreateItemForm
              onSuccess={() => {
                toast.add({ title: "Unit successfully created." });
                refreshItems();
              }}
              onFail={() => {
                toast.add({ title: "Failed to create unit." });
              }}
              statuses={meta.status}
              groupId={groupId}
            />
          </ModalWithToast>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 mx-10 my-4">
        {curatedItems.map((item) => {
          const activeReservation = reservations
            .filter((reservation) => reservation.item_id === item.id)
            .find(
              (reservation) =>
                reservation.returned_at === null &&
                new Date(reservation.start_at) <= new Date()
            );

          return (
            <ItemCard
              key={`item-${item.id}`}
              item={item}
              pointer
              activeReservation={activeReservation}
            />
          );
        })}
        {extraCards}
      </div>
    </div>
  );
};

export { ItemList };

