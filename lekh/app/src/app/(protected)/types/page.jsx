"use client";

import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { EquipmentContext } from "@/context/equipment-context";
import { UserContext } from "@/context/user-context";
import { GroupCard } from "@/components/group-card";
import { ModalWithToast } from "@/components/modal-with-toast";
import { CreateGroupForm } from "@/components/create-group-form";

const Page = () => {
  const router = useRouter();
  const { groups, refreshGroups } = useContext(EquipmentContext);
  const { user } = useContext(UserContext);
  const [ message, setMessage ] = useState("");

  const allItems = {
    id: 0,
    name: "All units",
    description: "List all units"
  };

  const onMessageHandled = () => setMessage("");

  return (
    <>
      <div className="container md:mx-auto pl-10 mt-4 text-2xl font-bold">
        All Types
      </div>
      <div className="container mx-auto">
        { (user.role_id == 1) && <ModalWithToast {...{ title: "Add Type", message, onMessageHandled }}>
          <CreateGroupForm {...{
            onSuccess: () => {
              setMessage("Type successfully added.");
              refreshGroups();
            },
            onFail: () => setMessage("Failed to add type.")
          }} />
        </ModalWithToast> }


        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 mx-10 my-4">
          <GroupCard key="group-0" {...{ group: allItems }} />
          {groups.map((group) => <GroupCard key={`group-${group.id}`} {...{ group }} />)}
        </div>
      </div>
    </>
  );
};

export default Page;
