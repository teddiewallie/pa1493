"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useContext, useState } from "react";
import { UserContext } from "@/context/user-context";
import { EquipmentContext } from "@/context/equipment-context";
import { ItemCard } from "@/components/item-card";
import { ModalWithToast } from "@/components/modal-with-toast";
import { CreateItemForm } from "@/components/create-item-form";
import { SimpleCard } from "@/components/simple-card";
import { Button } from "@/components/ui/button";

const Page = ({ params }) => {
  const { id } = use(params);
  const router = useRouter();

  const { user } = useContext(UserContext);
  const { items, refreshItems, meta, groups } = useContext(EquipmentContext);

  const [message, setMessage] = useState("");

  const item = items?.find((item) => (item.id == id));
  const group = groups?.find((group) => group.id == item.group_id);

  const onMessageHandled = () => setMessage("");

  const itemIssues = item?.known_issues;
  const groupIssues = group?.known_issues;

  return (
    <>
      <div className="container pl-10 md:mx-auto mt-4 text-2xl font-bold">
        {item && `${item.name} - ${item.serial}`}
      </div>
      <div className="flex container md:mx-auto">
        { <Link href={`/editor/for-unit/${id}`}>
            <Button
              className="ml-10 mt-4 print:hidden"
              variant="outline"
            >Add Article</Button>
          </Link>}
        { (user.role_id == 1) && <ModalWithToast {...{ title: "Edit Unit", message, onMessageHandled }}>
          <CreateItemForm {...{
            item,
            onSuccess: () => {
              setMessage("Item successfully created.");
              refreshItems();
            },
            onFail: () => setMessage("Failed to create item."),
            statuses: meta?.status
          }} />
        </ModalWithToast> }
      </div>

      <div className="container px-10 md:mx-auto grid grid-cols-1 gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 my-4">
        <ItemCard {...{ item, single: true }} />
        {itemIssues?.length > 0 && <SimpleCard {...{ title: "Known Unit Issues", description: itemIssues }} />}
        {groupIssues?.length > 0 && <SimpleCard {...{ title: "Known Type Issues", description: groupIssues }} />}
      </div>
    </>
  );
};

export default Page;

