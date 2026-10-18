"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ModalWithToast = ({
  title,
  message,
  onMessageHandled,
  doubleWidth,
  children,
}) => {
  const [open, setOpen] = useState(false);

  const handleMessage = useCallback(() => {
    if (!message) {
      return;
    }

    toast.add({ title: message });
    onMessageHandled();
    setOpen(false);
  }, [message, onMessageHandled]);

  // Handle messages when the dialog is closed or a submission finishes.
  if (message && open) {
    handleMessage();
  }

  const contentClassName = [
    doubleWidth ? "sm:max-w-[95vw] lg:max-w-[960px]" : "",
    "max-h-[calc(100vh-2rem)] flex-col overflow-y-scroll",
  ].filter(Boolean).join(" ");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="print:hidden" variant="outline">
            {title}
          </Button>
        }
      />
      <DialogContent className={contentClassName}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export { ModalWithToast };

