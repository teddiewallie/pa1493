import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const SignOutButton = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();

    router.push("/login");
  };

  return (<Button variant="outline" onClick={handleSignOut}>Sign Out</Button>);
};

export { SignOutButton };

