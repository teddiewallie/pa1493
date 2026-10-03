"use client";

import { useContext, useState } from "react";
import { UserContext } from "@/context/user-context";
import { EquipmentContext } from "@/context/equipment-context";
import { ModalWithToast } from "@/components/modal-with-toast";
import { CreateItemForm } from "@/components/create-item-form";
import { ItemCard } from "@/components/item-card";
import { useRouter } from "next/navigation";

const ItemList = ({ extraCards, groupId, children }) => {
  const { groups, items, refreshItems, meta } = useContext(EquipmentContext);
  const { user } = useContext(UserContext);
  const router = useRouter();
  const [message, setMessage] = useState("");

  const handleClick = (id) => {
    router.push(`/units/by-id/${id}`);
  };

  let curatedItems = groupId ? items.filter((item) => (item.group_id == groupId)) : items;

  return (
    <div className="container md:mx-auto">
      <div className="flex">
        {children}
        { (user.role_id == 1) && <ModalWithToast row {...{ title: "Add Unit", message }}>
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
        {extraCards}
        {curatedItems.map((item) => (<ItemCard key={`item-${item.id}`} {...{ item, handleClick, pointer: true }} />))}
      </div>
   </div>
  );
};

export { ItemList };

