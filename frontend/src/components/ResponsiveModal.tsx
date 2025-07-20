import React from "react";
import { useMediaQuery } from "react-responsive";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

export interface ResponsiveModalProps {
  children: React.ReactNode;
  className?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ResponsiveModal = ({
  children,
  open,
  onOpenChange,
  className,
}: ResponsiveModalProps) => {
  const isDesktop = useMediaQuery({ minWidth: 1024 });

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className={cn("w-full max-w-lg p-0 border-border bg-card/95 backdrop-blur-md shadow-sm", className)}>
          {children}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="border-border bg-card backdrop-blur-md">
        {children}
      </DrawerContent>
    </Drawer>
  );
};
