"use client";

import { use, useContext, useState } from "react";
import { UserContext } from "@/context/user-context";
import { EquipmentContext } from "@/context/equipment-context";
import { ItemList } from "@/components/item-list";
import { ModalWithToast } from "@/components/modal-with-toast";
import { CreateGroupForm } from "@/components/create-group-form";

const Page = ({params}) => {
  const { id } = use(params);
  const { user } = useContext(UserContext);
  const { groups, refreshGroups } = useContext(EquipmentContext);

  const group = groups.find((group) => (group.id == id));

  const [ message, setMessage ] = useState("");

  const onMessageHandled = () => setMessage("");

  return (
    <>
      <div className="container md:mx-auto pl-10 mt-4 text-2xl font-bold">
        {group && group.name}
      </div>

      <ItemList groupId={Number(id)}>
        { (user.role_id == 1) && <ModalWithToast row {...{ title: "Edit Type", message, onMessageHandled }}>
          <CreateGroupForm {...{
            group,
            onSuccess: () => {
              setMessage("Type successfully updated.");
              refreshGroups();
            },
            onFail: () => setMessage("Failed to update type."),
          }} />
        </ModalWithToast> }
      </ItemList>
    </>
  );
};

export default Page;
