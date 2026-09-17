// https://reui.io/blocks/application/navbar/navbar-10

"use client";

import { useContext } from "react";
import { UserContext } from "@/context/user-context";
import { SignOutButton } from "@/components/sign-out-button";
import { NavWrapper } from "@/components/nav-wrapper";

const TopBar = () => {
  const user = useContext(UserContext);

  return (
    <header className="border-border bg-background sticky top-0 z-20 flex h-12 w-full shrink-0 items-center justify-between gap-2 border-b px-4">
      <div className="hidden lg:flex shrink-0 items-center gap-2">
        <span className="font-bold font-serif mr-8">LEKH</span>
        <span className="font-bold">{user.name}</span>
      </div>
      <NavWrapper />
      <div className="hidden lg:flex items-center gap-2">
        <SignOutButton />
      </div>
    </header>
  );
};

export { TopBar };

