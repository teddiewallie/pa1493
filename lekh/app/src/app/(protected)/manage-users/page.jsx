// https://ui.shadcn.com/docs/components/base/dialog
// https://ui.shadcn.com/docs/components/base/toast

"use client";

import { Button } from "@/components/ui/button";
import { CreateUserForm } from "@/components/create-user-form";
import { useState } from "react";
import { toast } from "@/components/ui/toast";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Page = () => {
  const [ open, onOpenChange ] = useState(false);

  const onSuccess = () => {
    onOpenChange(false);
    toast.add({ title: "User successfully created." });
  };

  const onFail = () => {
    onOpenChange(false);
    toast.add({ title: "Failed to create user." });
  };

  return (
    <div className="container md:mx-auto mx-4 mt-4">
      <Dialog {...{ open, onOpenChange }}>
        <DialogTrigger render={
          <Button className="ml-auto" variant="outline">Create User</Button>
        } />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create User</DialogTitle>
            <DialogDescription>
            </DialogDescription>

          </DialogHeader>
          <CreateUserForm {...{ onSuccess, onFail }} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Page;
