"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import {
  Dialog,
  DialogContent,
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

  useEffect(() => {
    if (!message) {
      return;
    }

    toast.add({ title: message });

    if (onMessageHandled) {
      onMessageHandled();
    }

    setOpen(false);
  }, [message, onMessageHandled]);

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
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export { ModalWithToast };

