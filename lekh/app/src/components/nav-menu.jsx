import {
  NavigationMenu,
  NavigationMenuTrigger,
  NavigationMenuItem,
  NavigationMenuList
} from "@/components/ui/navigation-menu";

const NavMenu = ({ children }) => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
          {children} 
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
);

export { NavMenu };
