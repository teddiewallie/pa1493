// https://ui.shadcn.com/docs/components/base/dialog
// https://ui.shadcn.com/docs/components/base/toast

"use client";

import { Button } from "@/components/ui/button";
import { CreateUserForm } from "@/components/create-user-form";
import { useState, useEffect } from "react";
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

const ModalWithToast = ({
  title,
  message,
  children
}) => {
  const [ open, onOpenChange ] = useState(false);

  useEffect(() => {
    onOpenChange(false);
    if (message != "") {
      toast.add({ title: message });
    }
  }, [message]);

  return (
    <div className="container md:mx-auto mx-4 mt-4">
      <Dialog {...{ open, onOpenChange }}>
        <DialogTrigger render={
          <Button className="ml-auto" variant="outline">{title}</Button>
        } />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
            </DialogDescription>

          </DialogHeader>
            { children }
        </DialogContent>
      </Dialog>
    </div>
  );
};

export { ModalWithToast };

