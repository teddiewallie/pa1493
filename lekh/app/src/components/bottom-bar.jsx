// https://reui.io/blocks/application/navbar/navbar-10

"use client";

import { useRouter } from "next/navigation";
import { useContext } from "react";
import { UserContext } from "@/context/user-context";
import { SignOutButton } from "@/components/sign-out-button";
import { routes } from "@/routes";

const BottomBar = () => {
  const { user } = useContext(UserContext);
  const router = useRouter();

  const LinkItem = ({Icon, route}) => (
    <a onClick={() => router.push(route)} className="mx-3 flex cursor-pointer"><Icon className="inline mr-1" size={32} /></a>
  );

  return (
    <footer className="mt-auto flex lg:hidden border-border bg-background sticky bottom-0 z-20 h-12 w-full shrink-0 items-center justify-between gap-2 border-b px-4">
      <div className="flex w-full items-center justify-between">
          {routes.filter((route) => route.role_id >= user.role_id)
            .map((route) => <LinkItem key={route.key} {...{ Icon: route.Icon, route: route.route }}/>)}
        <SignOutButton type="bottom-bar"/>
      </div>
    </footer>
  );
};

export { BottomBar };

