"use client";

import { useRouter } from "next/navigation";
import { useContext } from "react";
import { UserContext } from "@/context/user-context";
import { Profile } from "@/components/profile";

const Page = () => {
  const { user } = useContext(UserContext);
  const router = useRouter();

  // We need a bigger refresh to flush out the stale session data.
  const refresh = (data) => router.refresh();

  return <Profile {...{user, refresh}} />
};

export default Page;

