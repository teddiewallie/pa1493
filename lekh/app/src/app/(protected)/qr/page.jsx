"use client";

import { useRouter } from "next/navigation";
import { Html5QrcodeWrapper } from "@/components/Html5QrcodeWrapper";

const Page = () => {
  const router = useRouter();

  const onScan = (serial) => {
     router.push(`/items/by-serial/${serial}`);
  };

  return <Html5QrcodeWrapper {...{ onScan }} />
};

export default Page;
