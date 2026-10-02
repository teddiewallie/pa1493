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

const GroupCard = ({ group, handleClick }) => {
  if (!group) {
    return <div />
  }

  const { items } = useContext(EquipmentContext);

  const { id, name, description } = group;

  const assetId = items.find((item) => (item.group_id == group.id)).asset_id;

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
      // TODO: Items status.
    </Card>
  );
};

export { GroupCard };

