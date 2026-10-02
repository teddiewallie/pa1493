import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { UsersProvider } from "@/provider/users-provider";
import { getLanding } from "@/routes";

const MaintainerLayout = async ({ children }) => {
  const session = await auth();

  if (session.user.roleId > 1) {
    redirect(getLanding().route);
  }

  return (
    <UsersProvider>
      {children}
    </UsersProvider>
  );
};

export default MaintainerLayout;

