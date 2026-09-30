"use client";

import { useState } from "react";
import { ModalWithToast } from "@/components/modal-with-toast";
import { CreateUserForm } from "@/components/create-user-form";
import { UsersList } from "@/components/users-list";

const Page = () => {
  const [message, setMessage] = useState("");

  return (
    <div className="container md:mx-auto">
      <ModalWithToast {...{ title: "Create User", message }}>
        <CreateUserForm {...{
          onSuccess: () => setMessage("User successfully created."),
          onFail: () => setMessage("Failed to create user.")
        }} />
      </ModalWithToast>
      <UsersList />
    </div>
  );
};

export default Page;

