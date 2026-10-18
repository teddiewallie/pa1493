"use client";

import { cloneElement, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ModalWithToast = ({
  title,
  doubleWidth,
  children,
}) => {
  const [open, setOpen] = useState(false);

  const callbackNames = [
    "onSuccess",
    "onFail",
    "onDelete",
    "onDeleteSuccess",
    "onDeleteFail",
  ];

  const childCallbacks = {};

  callbackNames.forEach((name) => {
    const callback = children.props?.[name];

    if (typeof callback === "function") {
      childCallbacks[name] = (...args) => {
        const result = callback(...args);
        setOpen(false);
        return result;
      };
    }
  });

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
        {cloneElement(children, childCallbacks)}
      </DialogContent>
    </Dialog>
  );
};

export { ModalWithToast };

