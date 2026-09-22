import {
  LayoutDashboard,
  Users,
  Keyboard
} from "lucide-react";

const routes = [
  { key: 1, Icon: LayoutDashboard, name: "Dashboard", route: "/dashboard", roleId: 100 },
  { key: 2, Icon: Users, name: "Users", route: "/users", roleId: 1 },
  { key: 3, Icon: Keyboard, name: "Items", route: "/items", roleId: 100 }
];

export { routes };

