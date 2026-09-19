// https://ui.shadcn.com/docs/components/base/dialog
// https://ui.shadcn.com/docs/components/base/toast

"use client";

import { useState } from "react";
import { ModalWithToast } from "@/components/modal-with-toast";
import { CreateUserForm } from "@/components/create-user-form";

const Page = () => {
  const [message, setMessage] = useState("");

  return (
    <ModalWithToast {...{ buttonLabel: "Create User", message }}>
      <CreateUserForm {...{
        onSuccess: () => setMessage("User successfully created."),
        onFail: () => setMessage("Failed to create user.")
      }} />
    </ModalWithToast>
  );
};

export default Page;
