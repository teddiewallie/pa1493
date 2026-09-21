"use client";

import { useState } from "react";
import { ModalWithToast } from "@/components/modal-with-toast";
import { CreateUserForm } from "@/components/create-user-form";

const Page = () => {
  const [message, setMessage] = useState("");

  return (
    <ModalWithToast {...{ title: "Create User", message }}>
      <CreateUserForm {...{
        onSuccess: () => setMessage("User successfully created."),
        onFail: () => setMessage("Failed to create user.")
      }} />
    </ModalWithToast>
  );
};

export default Page;
