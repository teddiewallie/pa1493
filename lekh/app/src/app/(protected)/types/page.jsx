"use client";

import { useRouter } from "next/navigation";
import { useContext } from "react";
import { EquipmentContext } from "@/context/equipment-context";
import { GroupCard } from "@/components/group-card";

const Page = () => {
  const router = useRouter();
  const { groups } = useContext(EquipmentContext);

  console.log(groups);

  const handleClick = (id) => {
    if (id === 0) {
      router.push("/units");
    } else {
      router.push(`/units/by-type/${id}`);
    }
  }

  const allItems = {
    id: 0,
    name: "All units",
    description: "List all units"
  };

  // TODO: ADD/EDIT GROUPS
  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 mx-10 my-4">
        <GroupCard key="group-0" {...{ group: allItems, handleClick }} />
        {groups.map((group) => <GroupCard key={`group-${group.id}`} {...{ group, handleClick }} />)}
      </div>
    </div>
  );
};

export default Page;
