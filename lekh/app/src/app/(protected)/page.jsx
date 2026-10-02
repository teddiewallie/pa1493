import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getLanding } from "@/routes";

const Page = async () => {
  const session = await auth();

  session ? redirect(getLanding().route) : redirect("/login");

  return (<div>Redirecting...</div>)
};

export default Page;
