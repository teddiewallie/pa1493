import {
  NavigationMenuContent,
  NavigationMenuLink
} from "@/components/ui/navigation-menu";

import { useRouter } from "next/navigation";

const NavItem = ({ name, route }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(route);
  };

  return (
    <NavigationMenuContent className="cursor-pointer">
      <NavigationMenuLink onClick={handleClick}>{name}</NavigationMenuLink>
    </NavigationMenuContent>
  );
};

export { NavItem };

