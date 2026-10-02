"use client";

import { useRouter } from "next/navigation";
import { use, useContext, useEffect } from "react";
import { ItemsContext } from "@/context/items-context";

const Page = ({ params }) => {
  const { serial } = use(params);
  const router = useRouter();

  const { items, loading } = useContext(ItemsContext);

  const item = items.find((item) => (item.serial == serial));

  useEffect(() => {
    if (!loading && item) {
      router.push(`/units/${item.id}`);
    }
  }, [loading, item, router])

  if (loading || item) {
    return null;
  }

  /*
   * Possible TODO: One of those fancy skeletons maybe?
   * shadcn has a Skeleton component for that.
   */

  return <div>Item not found.</div>;
};

export default Page;

