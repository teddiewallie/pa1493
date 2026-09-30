"use client";

import { use, useContext, useState } from "react";
import { UserContext } from "@/context/user-context";
import { ItemsContext } from "@/context/items-context";
import { ItemCard } from "@/components/item-card";
import { ModalWithToast } from "@/components/modal-with-toast";
import { CreateItemForm } from "@/components/create-item-form";

const Page = ({ params }) => {
  const { id } = use(params);

  const user = useContext(UserContext);

  const { items, refreshItems, meta } = useContext(ItemsContext);

  const [message, setMessage] = useState("");

  const item = items.find((item) => (item.id == id));

  const onMessageHandled = () => setMessage("");

  return (
    <div className="container md:mx-auto mx-12 my-4">
      { user.isAdmin && <ModalWithToast {...{ title: "Edit Item", message, onMessageHandled }}>
        <CreateItemForm {...{
          item,
          onSuccess: () => {
            setMessage("Item successfully created.");
            refreshItems();
          },
          onFail: () => setMessage("Failed to create item."),
          statuses: meta.status
        }} />
      </ModalWithToast> }

      <ItemCard {...{ item, single: true }} />
    </div>
  );
};

export default Page;

