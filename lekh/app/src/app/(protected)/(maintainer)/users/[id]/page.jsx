// Diffs in the link below are ChatGPT assisted
// https://github.com/dipt-pa1493-ht26/pa1493-tewa25-lekh-zda/pull/181/changes

"use client";

import { use, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UsersContext } from "@/context/users-context";
import { ReservationsContext } from "@/context/reservations-context";
import { Profile } from "@/components/profile";
import { deleteUser } from "@/service/delete-user";
import { toast } from "@/components/ui/toast";

const Page = ({params}) => {
  const { id } = use(params);
  const { users, refreshUsers } = useContext(UsersContext);
  const { refreshReservations } = useContext(ReservationsContext);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (message === "") {
      return;
    }

    toast.add({ title: message });
  }, [message]);

  const router = useRouter();

  const user = users.find((user) => (user.id == id));

  if (!user) {
    return (<div></div>);
  }

  return <Profile {...{
    user,
    refresh: refreshUsers,
    canDelete: true,
    onDelete: async () => {
      const result = await deleteUser(id);

      if (result) {
        setMessage("User deleted.");
        router.push("/users");
        refreshReservations();
        refreshUsers();
      } else {
        setMessage("Failed to delete user.");
      }
    }}} />
};

export default Page;

