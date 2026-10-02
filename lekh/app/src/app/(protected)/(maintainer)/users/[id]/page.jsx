"use client";

import { use, useContext, useState } from "react";
import { UsersContext } from "@/context/users-context";
import { ModalWithToast } from "@/components/modal-with-toast";
import { CreateUserForm } from "@/components/create-user-form";
import { UserCard } from "@/components/user-card";

const Page = ({params}) => {
  const { users } = useContext(UsersContext);
  const { id } = use(params);
  const [message, setMessage] = useState("");

  const user = users.filter((user) => (user.id == id))[0];

  console.log(user);

  return (
    <>
      <ModalWithToast {...{ title: "Create User", message }}>
        <CreateUserForm {...{
          onSuccess: () => setMessage("User successfully created."),
          onFail: () => setMessage("Failed to create user.")
        }} />
      </ModalWithToast>

      <div className="container md:mx-auto my-4 px-6">
        <UserCard {...{ user }} />
      </div>
    </>
  );
};

export default Page;

