"use client";

import { useContext, useState } from "react";
import { UserContext } from "@/context/user-context";
import { ItemsContext } from "@/context/items-context";
import { ModalWithToast } from "@/components/modal-with-toast";
import { CreateItemForm } from "@/components/create-item-form";

const Page = () => {
  const user = useContext(UserContext);
  const { items, refreshItems } = useContext(ItemsContext);

  const [message, setMessage] = useState("");

  console.log(items);

  return (
    <>
      { user.isAdmin && <ModalWithToast {...{ title: "Add Item", message }}>
        <CreateItemForm {...{
          onSuccess: () => setMessage("Item successfully created."),
          onFail: () => setMessage("Failed to create item.")
        }} />

      </ModalWithToast> }
      { items.map((item) => (<div key={item.id}>{item.name}<img src={`/api/asset/${item.asset_id}`} /></div>)) }
    </>
  );
};

export default Page;

