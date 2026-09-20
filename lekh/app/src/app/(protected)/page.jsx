import { auth } from "@/auth";
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await auth();

  session ? redirect("/dashboard") : redirect("/login");

  return (<div>Redirecting...</div>)
};

export default Page;
