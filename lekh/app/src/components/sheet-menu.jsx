"use client";

import { Button } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";
import { useState } from "react";
import { SignOutButton } from "@/components/sign-out-button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const SheetMenu = ({children}) => {
  const [open, onOpenChange] = useState(false);

  return (
    <Sheet {...{open, onOpenChange}}>
      <SheetTrigger render={
        <Button variant="outline" className="px-3">
          <MenuIcon />
        </Button>
      } />
      <SheetContent className="pt-9" onClick={() => onOpenChange(false)}>
        <SheetHeader>
          <SignOutButton />
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min">
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export { SheetMenu };
