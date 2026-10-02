import {
  LayoutDashboard,
  User,
  Users,
  Keyboard,
  ScanQrCode
} from "lucide-react";

const routes = [
  { key: 1, Icon: User, name: "Profile", route: "/profile", role_id: 100 },
  { key: 2, Icon: Users, name: "Users", route: "/users", role_id: 1 },
  { key: 3, Icon: ScanQrCode, name: "QR", route: "/qr", role_id: 100 },
  { key: 4, Icon: Keyboard, name: "Units", route: "/units", landing: true, role_id: 100 }
];

const getLanding = () => routes.find((route) => route.landing);

export { getLanding, routes };

