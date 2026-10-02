"use client";

import { useRouter } from "next/navigation";
import { useContext } from "react";
import { EquipmentContext } from "@/context/equipment-context";
import { GroupCard } from "@/components/group-card";

const Page = () => {
  const router = useRouter();
  const { groups } = useContext(EquipmentContext);

  console.log(groups);

  const handleClick = (id) => router.push(`/units/by-type/${id}`);

  // TODO: EDIT GROUPS
  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 mx-10 my-4">
        {groups.map((group) => <GroupCard {...{ group, handleClick }} />)}
      </div>
    </div>
  );
};

export default Page;
