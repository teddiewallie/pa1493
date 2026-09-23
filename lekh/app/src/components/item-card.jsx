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

import Image from "next/image";

const ItemCard = ({ item, handleClick, pointer, single }) => {
  if (!item) {
    return <div />
  }

  const { id, name, serial, description, asset_id } = item;

  const handleActualClick = (e) => {
    if (handleClick) {
      handleClick(id);
    }
  };

  let cardClassName = "relative overflow-hidden"
  cardClassName = `${cardClassName} ${pointer && "cursor-pointer"}`;
  cardClassName = `${cardClassName} ${single && "w-md"}`;

  return (
    <Card onClick={() => handleActualClick()} className={cardClassName}>
      <CardHeader>
        <CardTitle className="flex items-center">
          {name}
          <span className="ml-auto font-mono">{serial}</span>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <div className="relative aspect-video w-full flex items-center justify-center">
        <Image
          className="max-h-full w-auto object-contain rounded-lg"
          alt={name}
          width={800}
          height={600}
          src={`/api/asset/${item.asset_id}`}
          unoptimized
        />
      </div>
    </Card>
  );
};

export { ItemCard };
