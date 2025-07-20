'use client';

import { memo } from "react";
import { ResponsiveModal } from "@/components/ResponsiveModal";
import { DialogTitle } from "@/components/ui/dialog";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button"

import { DottedSeparator } from "@/components/DottedSeparator";

import { useTaskModalState } from "../hooks";

import { TaskForm } from "./TaskForm";

export const CreateTaskModal = memo(() => {
    const [isOpen, setIsOpen] = useTaskModalState();

    return (
        <ResponsiveModal
            open={isOpen}
            className="sm:min-w-[700px]"
            onOpenChange={setIsOpen}
        >
            <Card className="p-4 flex flex-col gap-4 border-none shadow-none overflow-y-auto">
                <CardHeader className="flex flex-col">
                    <DialogTitle className="text-xl font-bold mb-4">
                        Create a new task
                    </DialogTitle>
                    <DottedSeparator />
                </CardHeader>
                <TaskForm onSave={() => setIsOpen(false)}>
                    <Button 
                        variant="secondary" 
                        onClick={() => setIsOpen(false)}
                    >
                        Cancel
                    </Button>
                </TaskForm>
            </Card>
        </ResponsiveModal>
    )
});