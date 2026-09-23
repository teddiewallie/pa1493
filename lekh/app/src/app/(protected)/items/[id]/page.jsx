"use client";

import { use, useContext } from "react";
import { ItemsContext } from "@/context/items-context";
import { ItemCard } from "@/components/item-card";

const Page = ({ params }) => {
  const { id } = use(params);

  const { items, refreshItems } = useContext(ItemsContext);

  const item = items.find((item) => (item.id == id));

  return (
    <div className="container md:mx-auto mx-10 my-4">
      <ItemCard {...{ item, single: true }} />
    </div>
  );
};

export default Page;
