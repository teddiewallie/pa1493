// https://ui.shadcn.com/docs/components/base/navigation-menu
// https://lucide.dev/guide/react/getting-started
// https://ui.shadcn.com/docs/components/radix/sheet

import { SheetMenu } from "@/components/sheet-menu";
import { SheetItem } from "@/components/sheet-item";
import { NavMenu } from "@/components/nav-menu";
import { NavItem } from "@/components/nav-item";

import { useContext } from "react";
import { UserContext } from "@/context/user-context";

import { routes } from "@/routes";

const NavWrapper = () => {
  const user = useContext(UserContext);
  return (
    <>
      <div className="hidden lg:flex">
        <NavMenu>
          {routes.filter((route) => route.roleId >= user.roleId)
            .map((route) => <NavItem name={route.name} route={route.route} key={route.key} />)}
        </NavMenu>
      </div>
      <div className="flex lg:hidden">
        <SheetMenu>
          { routes.filter((route) => route.roleId >= user.roleId)
            .map((route) => <SheetItem name={route.name} route={route.route} key={route.key} />)}
        </SheetMenu>
      </div>
    </>);
};

export { NavWrapper };
