import React, { useState } from "react";

import { DialogTitle } from "@/components/ui/dialog";
import { Button, type ButtonProps } from "@/components/ui/button";
import { ResponsiveModal } from "@/components/ResponsiveModal";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";

export const useConfirm = (
  title: string,
  message: string,
  variant: ButtonProps["variant"] = "primary"
): [() => React.ReactElement, () => Promise<unknown>] => {
  const [promise, setPromise] = useState<{ resolve: (value: boolean) => void } | null>(null);

  const confirm = () => {
    return new Promise((resolve) => {
      setPromise({ resolve });
    });
  };

  const handleClose = () => {
    setPromise(null);
  };

  const handleConfirm = () => {
    promise?.resolve(true);
    handleClose();
  };

  const handleCancel = () => {
    promise?.resolve(false);
    handleClose();
  };

  const ConfirmationDialog = () => (
    <ResponsiveModal open={promise !== null} onOpenChange={handleClose}>
      <Card className="w-full p-4 h-full border-none shadow-none">
        <CardHeader className="flex mb-4">
            <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>{message}</CardDescription>
        </CardContent>
        <CardFooter className="pt-4 w-full flex flex-col gap-y-2 lg:flex-row gap-x-2 items-center justify-end">
            <Button onClick={handleCancel} variant="outline" className="w-full lg:w-auto">
              Cancel
            </Button>
            <Button onClick={handleConfirm} variant={variant} className="w-full lg:w-auto">
              Confirm
            </Button>
          </CardFooter>
      </Card>
    </ResponsiveModal>
  );

  return [ConfirmationDialog, confirm];
};
