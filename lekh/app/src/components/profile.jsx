"use client";

import { ModalWithToast } from "@/components/modal-with-toast";
import { CreateUserForm } from "@/components/create-user-form";
import { UserCard } from "@/components/user-card";
import { PendingsWrapper } from "@/components/pendings-wrapper";
import { toast } from "@/components/ui/toast";

const Profile = ({ user, refresh, canDelete, onDelete }) => {
  return (
    <>
      <div className="container grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6 md:mx-auto px-10 mt-4">
        <ModalWithToast title="Edit User">
          <CreateUserForm
            canDelete={canDelete}
            onSuccess={() => {
              toast.add({ title: "User successfully edited." });

              if (user.role_id == 1) {
                refresh();
              }
            }}
            onFail={() => {
              toast.add({ title: "Failed to edit user." });
            }}
            onDelete={onDelete}
            user={user}
          />
        </ModalWithToast>
      </div>

      <div className="container px-10 md:mx-auto grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 my-4">
        <UserCard user={user} single />
      </div>

      {user.role_id == 1 && (
        <div className="container px-10 md:mx-auto grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 my-4">
          <PendingsWrapper />
        </div>
      )}
    </>
  );
};

export { Profile };

