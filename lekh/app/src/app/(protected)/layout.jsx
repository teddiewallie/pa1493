import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { UserProvider } from "@/components/user-provider";
import { TopBar } from "@/components/top-bar";
import { Toaster } from "@/components/ui/toast";

const ProtectedLayout = async ({ children }) => {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const user = {
    ...session?.user,
    isAdmin: session?.user.roleId === 1
  };

  return (
    <UserProvider user={user}>
      <TopBar />
      {children}
      <Toaster />
    </UserProvider>
  );
};

export default ProtectedLayout;

