// https://ui.shadcn.com/docs/components/base/card

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardContent,
  CardTitle
} from "@/components/ui/card";

import Image from "next/image";

const ItemCard = ({ item }) => {
  const { id, name, description, asset_id } = item;
  return (

    <Card className="relative overflow-hidden">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <div className="relative aspect-video w-full flex items-center justify-center">
        <Image
          className="max-h-full w-auto object-contain rounded-lg"
          alt={name}
          width={800}
          height={600}
          src={`/api/asset/${item.asset_id}`}
        />
      </div>
    </Card>
  );
};

export { ItemCard };
