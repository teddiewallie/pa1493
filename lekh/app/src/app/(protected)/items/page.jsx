"use client";

import { useContext, useState } from "react";
import { UserContext } from "@/context/user-context";
import { ModalWithToast } from "@/components/modal-with-toast";
import { CreateItemForm } from "@/components/create-item-form";

const Page = () => {
  const user = useContext(UserContext);

  const [message, setMessage] = useState("");

  return (
    <>
      { user.isAdmin && <ModalWithToast {...{ title: "Add Item", message }}>
        <CreateItemForm {...{
          onSuccess: () => setMessage("Item successfully created."),
          onFail: () => setMessage("Failed to create item.")
        }} />
      </ModalWithToast> }
    </>
  );
};

export default Page;

