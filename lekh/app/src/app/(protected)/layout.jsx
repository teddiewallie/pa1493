import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { UserProvider } from "@/components/user-provider";
import { TopBar } from "@/components/top-bar";

const ProtectedLayout = async ({ children }) => {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <UserProvider user={session?.user}>
      <TopBar />
    </UserProvider>
  );
};

export default ProtectedLayout;

