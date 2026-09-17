// https://ui.shadcn.com/docs/components/base/dialog

"use client";

import { Button } from "@/components/ui/button";
import { CreateUserForm } from "@/components/create-user-form";
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
  return (
    <div className="container md:mx-auto mx-4 mt-4">
      <Dialog>
        <DialogTrigger render={
          <Button className="ml-auto" variant="outline">Create User</Button>
        } />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create User</DialogTitle>
            <DialogDescription>
            </DialogDescription>

          </DialogHeader>
          <CreateUserForm />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Page;
