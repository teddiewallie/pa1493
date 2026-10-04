// https://reui.io/blocks/application/navbar/navbar-10

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { UserContext } from "@/context/user-context";
import { SignOutButton } from "@/components/sign-out-button";
import { routes } from "@/routes";

const TopBar = () => {
  const { user } = useContext(UserContext);
  const router = useRouter();

  const LinkItem = ({Icon, route, name}) => (
    <Link href={route} className="mx-3 flex cursor-pointer"><Icon className="inline mr-1" />{name}</Link>
  );

  return (
    <header className="hidden lg:flex border-border bg-background sticky top-0 z-20 h-12 w-full shrink-0 items-center justify-between gap-2 border-b px-4">
      <div className="flex shrink-0 items-center gap-2">
        <span className="font-bold font-serif mr-8">LEKH</span>
        <span className="font-bold">{user.name}</span>
      </div>
      <div className="flex">
        {routes.filter((route) => route.role_id >= user.role_id)
          .map((route) => <LinkItem key={route.key} {...{ Icon: route.Icon, route: route.route, name: route.name }} />)}
      </div>
      <div className="hidden lg:flex items-center gap-2">
        <SignOutButton />
      </div>
    </header>
  );
};

export { TopBar };

