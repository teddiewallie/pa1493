"use client";

import { useState } from "react";
import { ModalWithToast } from "@/components/modal-with-toast";

const Page = () => {
  const [message, setMessage] = useState("");
  return (
    <ModalWithToast {...{ buttonLabel: "Add Item", message }}>
      Create Item
    </ModalWithToast>
  );
};

export default Page;

