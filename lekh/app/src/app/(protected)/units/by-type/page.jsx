"use client";

import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  router.push("/types");
  return (<div>Redirecting...</div>);
};

export default Page;
