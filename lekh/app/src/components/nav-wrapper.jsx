// https://ui.shadcn.com/docs/components/base/navigation-menu
// https://lucide.dev/guide/react/getting-started
// https://ui.shadcn.com/docs/components/radix/sheet

import { SheetMenu } from "@/components/sheet-menu";
import { SheetItem } from "@/components/sheet-item";
import { NavMenu } from "@/components/nav-menu";
import { NavItem } from "@/components/nav-item";

import { useContext } from "react";
import { UserContext } from "@/context/user-context";

const links = [
  { key: 1, name: "Dashboard", route: "/dashboard", roleId: 2 },
  { key: 2, name: "Manage Users", route: "/manage-users", roleId: 1 }
];

const NavWrapper = () => {
  const user = useContext(UserContext);
  return (
    <>
      <div className="hidden lg:flex">
        <NavMenu>
          {links.filter((link) => link.roleId >= user.roleId)
            .map((link) => <NavItem name={link.name} route={link.route} key={link.key} />)}
        </NavMenu>
      </div>
      <div className="flex lg:hidden">
        <SheetMenu>
          { links.filter((link) => link.roleId >= user.roleId)
            .map((link) => <SheetItem name={link.name} route={link.route} key={link.key} />)}
        </SheetMenu>
      </div>
    </>);
};

export { NavWrapper };
