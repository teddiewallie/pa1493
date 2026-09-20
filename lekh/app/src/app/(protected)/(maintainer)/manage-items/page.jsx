"use client";

import { useState } from "react";
import { ModalWithToast } from "@/components/modal-with-toast";
import { CreateItemForm } from "@/components/create-item-form";

const Page = () => {
  const [message, setMessage] = useState("");

  return (
    <ModalWithToast {...{ title: "Add Item", message }}>
      <CreateItemForm {...{
        onSuccess: () => setMessage("Item successfully created."),
        onFail: () => setMessage("Failed to create item.")
      }} />
    </ModalWithToast>
  );
};

export default Page;

