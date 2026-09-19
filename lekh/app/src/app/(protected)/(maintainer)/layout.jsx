import { auth } from "@/auth";
import { redirect } from "next/navigation";

const MaintainerLayout = async ({ children }) => {
  const session = await auth();

  if (session.user.roleId > 1) {
    redirect("/dashboard");
  }

  return children;
};

export default MaintainerLayout;

