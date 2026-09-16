import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Layout } from "../layout";

export default async function ProtectedLayout({ children }) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <Layout>
      children
    </Layout>
  );
}

