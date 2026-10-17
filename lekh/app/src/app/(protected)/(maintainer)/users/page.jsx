"use client";

import { useState } from "react";
import { ModalWithToast } from "@/components/modal-with-toast";
import { CreateUserForm } from "@/components/create-user-form";
import { UsersList } from "@/components/users-list";

const Page = () => {
  const [message, setMessage] = useState("");

  return (
    <div className="container md:mx-auto">
      <div className="container grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6 md:mx-auto px-10 mt-4">
        <ModalWithToast {...{ title: "Create User", message }}>
          <CreateUserForm {...{
            onSuccess: () => setMessage("User successfully created."),
            onFail: () => setMessage("Failed to create user.")
          }} />
        </ModalWithToast>
      </div>
      <UsersList />
    </div>
  );
};

export default Page;

