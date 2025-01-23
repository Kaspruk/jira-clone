'use client';

import { ResponsiveModal } from "@/components/ResponsiveModal";
import { DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button"

import { DottedSeparator } from "@/components/DottedSeparator";

import { useTaskModalState } from "../hooks";

import { TaskForm } from "./TaskForm";

export const CreateTaskModal = () => {
    const [isOpen, setIsOpen] = useTaskModalState();

    return (
        <ResponsiveModal
            open={isOpen}
            className="max-w-4xl"
            onOpenChange={setIsOpen}
        >
            <Card className="w-full p-4 h-full border-none shadow-none">
                <CardHeader className="flex flex-col mb-4">
                    <DialogTitle className="text-xl font-bold mb-4">
                        Create a new task
                    </DialogTitle>
                    <DottedSeparator />
                </CardHeader>
                <CardContent>
                    <TaskForm onSave={() => setIsOpen(false)}>
                        <Button 
                            variant="secondary" 
                            onClick={() => setIsOpen(false)}
                        >
                            Cancel
                        </Button>
                    </TaskForm>
                </CardContent>
            </Card>
        </ResponsiveModal>
    )
};