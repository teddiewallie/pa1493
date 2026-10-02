"use client";

import { use } from "react";
import { ItemList } from "@/components/item-list";

const Page = ({params}) => {
  const { id } = use(params);

  return <ItemList groupId={id} />
};

export default Page;

