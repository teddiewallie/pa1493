"use client";

import { use, useContext } from "react";
import { UsersContext } from "@/context/users-context";
import { Profile } from "@/components/profile";

const Page = ({params}) => {
  const { id } = use(params);
  const { users, refreshUsers } = useContext(UsersContext);

  const user = users.find((user) => (user.id == id));

  if (!user) {
    return (<div></div>);
  }

  return <Profile {...{user, refreshUsers}} />
};

export default Page;

