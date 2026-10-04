// https://ui.shadcn.com/docs/components/base/card
// https://nextjs.org/docs/app/api-reference/components/image#loading

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardContent,
  CardTitle
} from "@/components/ui/card";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { EquipmentContext } from "@/context/equipment-context";
import Image from "next/image";
import { QRCode } from "@/components/qr-code";
import { ItemStatus } from "@/components/item-status";

const ItemCard = ({ item, pointer, single }) => {
  const { groups } = useContext(EquipmentContext);
  const router = useRouter();

  if (!item) {
    return <div />
  }

  const group = groups?.find((group) => group.id == item.group_id);

  const { id, name, serial, description, shelf, asset_id, status_name } = item;

  let cardClassName = "relative overflow-hidden md:max-w-md";
  cardClassName = `${cardClassName} ${pointer && "cursor-pointer"}`;
  // cardClassName = `${cardClassName} ${single && ""}`;

  return (
    <Link href={`/units/by-id/${id}`}>
      <Card>
        <div className="flex items-center">
          <CardHeader className="min-w-0 flex-1">
            <CardTitle className="grid grid-cols-[1fr_auto] gap-2">
              <span className="min-w-0">{name}</span>
              <span className="font-mono">{shelf}</span>
            </CardTitle>

            <CardDescription className="grid grid-cols-[1fr_auto] gap-2">
              <span className="min-w-0">{description}</span>
              <span className="font-mono">{serial}</span>
            </CardDescription>
          </CardHeader>
          <QRCode value={serial} className="print:hidden w-16 h-16 mr-4 shrink-0 border p-1" />
        </div>

        <div className="relative aspect-video w-full flex items-center justify-center">
          <QRCode value={serial} className="hidden print:block w-24 h-24" />
          <Image
            className="print:hidden max-h-full w-auto object-contain rounded-lg"
            alt={name}
            width={800}
            height={600}
            src={`/api/asset/${item.asset_id}`}
            unoptimized
          />
        </div>
        <ItemStatus id={item.status_id} name={item.status_name} />
        {single && <div className="flex print:hidden items-center justify-left mx-4 -mt-2">
          <div className="flex-1">Type</div>
          <div className="flex items-center">
            <Link
              href={`/units/by-type/${group?.id}`}
              className="cursor-pointer underline decoration-dashed"
            >
              {group?.name}
            </Link>
          </div>
        </div>}
      </Card>
    </Link>
  );
};

export { ItemCard };

