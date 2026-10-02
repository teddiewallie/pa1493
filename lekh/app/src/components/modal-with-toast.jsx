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
  DialogTrigger
} from "@/components/ui/dialog";

const ModalWithToast = ({
  title,
  message,
  onMessageHandled,
  doubleWidth,
  children
}) => {
  const [ open, onOpenChange ] = useState(false);

  useEffect(() => {
    onOpenChange(false);
    if (message != "") {
      toast.add({ title: message });
      onMessageHandled();
    }
  }, [message]);

  let contentClassName = doubleWidth
    ? "sm:max-w-[95vw] lg:max-w-[960px]"
    : "";

  contentClassName = `${contentClassName} max-h-[calc(100vh-2rem)] flex-col overflow-y-scroll`;

  return (
    <div className="container md:mx-auto mt-4">
      <Dialog {...{ open, onOpenChange }}>
        <DialogTrigger render={
          <Button className="ml-auto mx-10 print:hidden" variant="outline">{title}</Button>
        } />
        <DialogContent className={contentClassName}>
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

