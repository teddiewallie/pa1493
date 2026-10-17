"use client";

import { useContext, useState } from "react";
import { UserContext } from "@/context/user-context";
import { EquipmentContext } from "@/context/equipment-context";
import { ModalWithToast } from "@/components/modal-with-toast";
import { CreateItemForm } from "@/components/create-item-form";
import { ItemCard } from "@/components/item-card";
import { useRouter } from "next/navigation";

const ItemList = ({ extraCards, groupId, children, onMessageHandled }) => {
  const { groups, items, refreshItems, meta } = useContext(EquipmentContext);
  const { user } = useContext(UserContext);
  const router = useRouter();
  const [message, setMessage] = useState("");

  let curatedItems = groupId ? items.filter((item) => (item.group_id == groupId)) : items;

  return (
    <div className="container md:mx-auto">
      <div className="container grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6 md:mx-auto px-10 mt-2">
        {children}
        { (user.role_id == 1) && <ModalWithToast row {...{ title: "Add Unit", message, onMessageHandled }}>
          <CreateItemForm {...{
            onSuccess: () => {
              setMessage("Unit successfully created.");
              refreshItems();
            },
            onFail: () => setMessage("Failed to create unit."),
            statuses: meta.status,
            groupId
          }} />
        </ModalWithToast> }
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 mx-10 my-4">
        {curatedItems.map((item) => (<ItemCard key={`item-${item.id}`} {...{ item, pointer: true }} />))}
        {extraCards}
      </div>
   </div>
  );
};

export { ItemList };

