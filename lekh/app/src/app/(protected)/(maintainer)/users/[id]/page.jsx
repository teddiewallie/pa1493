"use client";

import { use, useContext } from "react";
import { UsersContext } from "@/context/users-context";
import { UserCard } from "@/components/user-card";

const Page = ({params}) => {
  const { users } = useContext(UsersContext);
  const { id } = use(params);

  const user = users.filter((user) => (user.id == id))[0];

  console.log(user);

  return (
    <div className="container md:mx-auto my-4">
      <UserCard {...{ user }} />
    </div>
  );
};

export default Page;

