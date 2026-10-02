"use client";

import { useContext, useState } from "react";
import { UserContext } from "@/context/user-context";
import { ItemsContext } from "@/context/items-context";
import { ModalWithToast } from "@/components/modal-with-toast";
import { CreateItemForm } from "@/components/create-item-form";
import { ItemCard } from "@/components/item-card";
import { useRouter } from "next/navigation";

const Page = () => {
  const user = useContext(UserContext);
  const router = useRouter();

  const { items, refreshItems, meta } = useContext(ItemsContext);

  const [message, setMessage] = useState("");

  const handleClick = (id) => {
    router.push(`/items/${id}`);
  };

  return (
    <div className="container md:mx-auto">
      { user.isAdmin && <ModalWithToast doubleWidth {...{ title: "Add Item", message }}>
        <CreateItemForm {...{
          onSuccess: () => {
            setMessage("Item successfully created.");
            refreshItems();
          },
          onFail: () => setMessage("Failed to create item."),
          statuses: meta.status
        }} />
      </ModalWithToast> }

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 mx-10 my-4">
        { items.map((item) => (<ItemCard key={`item-${item.id}`} {...{ item, handleClick, pointer: true }} />)) }
      </div>
   </div>
  );
};

export default Page;

