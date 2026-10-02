import {
  LayoutDashboard,
  Users,
  Keyboard,
  ScanQrCode
} from "lucide-react";

const routes = [
  { key: 1, Icon: Users, name: "Users", route: "/users", roleId: 1 },
  { key: 2, Icon: ScanQrCode, name: "QR", route: "/qr", roleId: 100 },
  { key: 3, Icon: Keyboard, name: "Items", route: "/items", landing: true, roleId: 100 }
];

const getLanding = () => routes.find((route) => route.landing);

export { getLanding, routes };

