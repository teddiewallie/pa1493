"use client";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardContent,
  CardTitle
} from "@/components/ui/card";

import { useContext } from "react";
import Image from "next/image";
import { EquipmentContext } from "@/context/equipment-context";
import { ItemStatus } from "@/components/item-status";

const GroupCard = ({ group, handleClick }) => {
  if (!group) {
    return <div />
  }

  const { items } = useContext(EquipmentContext);

  const { id, name, description } = group;

  let groupItems = items;
  let assetId = 0;

  if (id !== 0) {
    groupItems = items.filter((item) => (item.group_id == group.id));
    assetId = groupItems[0]?.asset_id;
  }

  const totalItems = groupItems.length;
  const availableItems = groupItems.filter((item) => (item.status_id == 1)).length;
  const statusName = `${availableItems}/${totalItems}`;
  const statusId = availableItems > 0 ? 1 : 2;

  const handleActualClick = (e) => {
    if (handleClick) {
      handleClick(id);
    }
  };

  return (
    <Card onClick={() => handleActualClick()} className="relative overflow-hidden md:max-w-md cursor-pointer">
      <div className="flex items-center">
        <CardHeader className="min-w-0 flex-1">
          <CardTitle>
            {name}
          </CardTitle>

          <CardDescription>
            {description}
          </CardDescription>
        </CardHeader>
      </div>

      <div className="relative aspect-video w-full flex items-center justify-center">
        <Image
          className="print:hidden max-h-full w-auto object-contain rounded-lg"
          alt={name}
          width={800}
          height={600}
          src={`/api/asset/${assetId}`}
          unoptimized
        />
      </div>
      <ItemStatus {...{ name: statusName, id: statusId }} />
    </Card>
  );
};

export { GroupCard };

