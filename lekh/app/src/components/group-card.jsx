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
import { ReservationsContext } from "@/context/reservations-context";
import { ItemStatus } from "@/components/item-status";
import Link from "next/link";

const GroupCard = ({ group }) => {
  if (!group) {
    return <div />;
  }

  const { items } = useContext(EquipmentContext);
  const { reservations } = useContext(ReservationsContext);

  const { id, name, description } = group;

  let groupItems = items;
  let assetId = 0;

  if (id !== 0) {
    groupItems = items.filter((item) => (item.group_id == group.id));
    assetId = groupItems[0]?.asset_id;
  }

  const now = new Date();

  const availableItems = groupItems.filter((item) => {
    if (item.status_name !== "Available") {
      return false;
    }

    const itemReservations = reservations
      .filter((reservation) => reservation.item_id === item.id)
      .sort((a, b) => new Date(a.start_at) - new Date(b.start_at));

    const activeReservation = itemReservations.find((reservation) => (
        reservation.returned_at === null &&
        new Date(reservation.start_at) <= now
    ));

    return !activeReservation;
  }).length;

  const totalItems = groupItems.length;
  const stock = `${availableItems}/${totalItems}`;
  const statusName = availableItems ? "Available" : "Unavailable";

  return (
    <Link href={`/units/by-type/${id}`}>
      <Card className="relative overflow-hidden md:max-w-md cursor-pointer">
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

        <ItemStatus {...{ name: statusName, extra: stock }} />
      </Card>
    </Link>
  );
};

export { GroupCard };

