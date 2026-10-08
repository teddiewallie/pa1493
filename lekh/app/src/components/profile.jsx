"use client";

import { use, useContext, useState } from "react";
import { ModalWithToast } from "@/components/modal-with-toast";
import { CreateUserForm } from "@/components/create-user-form";
import { UserCard } from "@/components/user-card";
import { PendingsWrapper } from "@/components/pendings-wrapper";

const Profile = ({user, refresh}) => {
  const [message, setMessage] = useState("");
  const onMessageHandled = () => setMessage("");

  return (
    <>
      <ModalWithToast {...{ title: "Edit User", message, onMessageHandled }}>
        <CreateUserForm {...{
          onSuccess: (data) => {
            setMessage("User successfully edited.");
            if (user.role_id == 1) {
              refresh(data);
            }
          },
          onFail: () => setMessage("Failed to edit user."),
          user
        }} />
      </ModalWithToast>

      <div className="container px-6 md:mx-auto grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 my-4">
        <UserCard {...{ user, single: true }} />
      </div>
      { user.role_id == 1 && <div className="container px-6 md:mx-auto grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 my-4">
        <PendingsWrapper />
      </div> }
    </>
  );
};

export { Profile };

