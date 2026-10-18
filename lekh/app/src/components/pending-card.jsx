import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardContent,
  CardTitle
} from "@/components/ui/card";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns"
import { toast } from "@/components/ui/toast";

import {
  approveReservation,
  denyReservation
} from "@/service/save-reservation";

import Image from "next/image";
import Link from "next/link";

const PendingCard = ({ item, pending, user, refresh }) => {
  const [message, setMessage] = useState("");
  useEffect(() => {
    if (message === "") {
      return;
    }

    toast.add({ title: message });
    setMessage("");
  }, [message]);

  const verdict = async (isApproved) => {
    if (isApproved) {
      const result = await approveReservation(pending.id);
      setMessage(result ? "Request approved." : "Error approving request.");
    } else {
      const result = await denyReservation(pending.id);
      setMessage(result ? "Request denied." : "Error denying request.");
    }

    refresh();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{user.name}</CardTitle>
        <CardDescription>
          {format(pending.start_at, "yyyy-MM-dd")}
          {" - "}
          {format(pending.end_at, "yyyy-MM-dd")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Link href={`/units/by-id/${item.id}`}>
          {item.name} - {item.serial}
          <div className="mt-4 relative aspect-video w-full flex items-center justify-center">
            <Image
              className="print:hidden max-h-full w-auto object-contain rounded-lg"
              alt=""
              width={800}
              height={600}
              src={`/api/asset/${item.asset_id}`}
              unoptimized
            />
          </div>
        </Link>
        <div className="mt-4">
          <div className="grid grid-cols-2 gap-2">
            <Button variant="secondary" onClick={() => verdict(false)}>Deny</Button>
            <Button onClick={() => verdict(true)}>Approve</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export { PendingCard };

