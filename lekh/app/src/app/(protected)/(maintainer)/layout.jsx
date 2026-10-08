import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getLanding } from "@/routes";

const MaintainerLayout = async ({ children }) => {
  const session = await auth();

  if (session.user.role_id > 1) {
    redirect(getLanding().route);
  }

  return (
    {children}
  );
};

export default MaintainerLayout;

