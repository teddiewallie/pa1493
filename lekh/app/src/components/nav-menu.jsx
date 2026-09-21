import {
  NavigationMenu,
  NavigationMenuViewport,
  NavigationMenuTrigger,
  NavigationMenuItem,
  NavigationMenuList
} from "@/components/ui/navigation-menu";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const NavMenu = ({ children }) => {
  const [value, setValue] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    setTimeout(() => setValue(""), 100);
  }, [pathname]);

  return (
    <NavigationMenu value={value} onValueChange={setValue}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
          {children} 
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export { NavMenu };

