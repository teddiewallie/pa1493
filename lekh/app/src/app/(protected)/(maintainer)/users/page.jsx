// Diffs in the link below are ChatGPT assisted
// https://github.com/dipt-pa1493-ht26/pa1493-tewa25-lekh-zda/pull/181/changes

"use client";

import { ModalWithToast } from "@/components/modal-with-toast";
import { CreateUserForm } from "@/components/create-user-form";
import { UsersList } from "@/components/users-list";
import { toast } from "@/components/ui/toast";

const Page = () => {
  return (
    <div className="container md:mx-auto">
      <div className="container grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6 md:mx-auto px-10 mt-4">
        <ModalWithToast title="Create User">
          <CreateUserForm
            onSuccess={() => {
              toast.add({ title: "User successfully created." });
            }}
            onFail={() => {
              toast.add({ title: "Failed to create user." });
            }}
          />
        </ModalWithToast>
      </div>
      <UsersList />
    </div>
  );
};

export default Page;

