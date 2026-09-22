import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

const SignOutButton = ({ type }) => {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirectTo: "/login" });
  };

  if (type === "bottom-bar") {
    return (<a className="cursor-pointer" onClick={handleSignOut}><LogOut /></a>);
  }

  return (<Button variant="outline" onClick={handleSignOut}>Sign Out</Button>);
};

export { SignOutButton };

