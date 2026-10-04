"use client";

import { use, useContext, useState } from "react";
import { ModalWithToast } from "@/components/modal-with-toast";
import { CreateUserForm } from "@/components/create-user-form";
import { UserCard } from "@/components/user-card";

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

      <div className="container md:mx-auto my-4 px-6">
        <UserCard {...{ user, single: true }} />
      </div>
    </>
  );
};

export { Profile };

