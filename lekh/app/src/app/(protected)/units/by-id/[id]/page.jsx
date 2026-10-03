"use client";

import { use, useContext, useState } from "react";
import { UserContext } from "@/context/user-context";
import { EquipmentContext } from "@/context/equipment-context";
import { ItemCard } from "@/components/item-card";
import { ModalWithToast } from "@/components/modal-with-toast";
import { CreateItemForm } from "@/components/create-item-form";
import { SimpleCard } from "@/components/simple-card";

const Page = ({ params }) => {
  const { id } = use(params);

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
      <div className="container md:mx-auto pl-10 mt-4 text-2xl font-bold">
        {item && `${item.name} - ${item.serial}`}
      </div>
      <div className="container md:mx-auto">
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

        <div className="grid grid-cols-1 gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mx-10 my-4">
          <ItemCard {...{ item, single: true }} />
          {itemIssues?.length > 0 && <SimpleCard {...{ title: "Known Unit Issues", description: itemIssues }} />}
          {groupIssues?.length > 0 && <SimpleCard {...{ title: "Known Type Issues", description: groupIssues }} />}
        </div>
      </div>
    </>
  );
};

export default Page;

