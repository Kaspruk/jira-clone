"use client";

import { memo, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { ResponsiveModal, type ResponsiveModalProps } from "@/components/ResponsiveModal";
import { DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ErrorMessage } from "@/components/ui/error-message";
import { DottedSeparator } from "@/components/DottedSeparator";
import { IconForm } from "@/components/IconForm";
import { TaskPriorityType } from "@/features/types";

import { useTaskPriorityModalState } from "../hooks";

type TasksPriorityFormProps = {
    data?: TaskPriorityType | null;
    workspaceId: number;
    onSubmit: (data: FormDataType) => void;
}

// Define the form data type
type FormDataType = Omit<TaskPriorityType, 'id'> & { id?: TaskPriorityType['id'] | null };

type TasksPriorityModalProps = Partial<Omit<ResponsiveModalProps, 'children'>> & Omit<TasksPriorityFormProps, 'onClose'>

const TasksPriorityForm = memo((props: TasksPriorityFormProps) => {
    const {
        data,
        workspaceId,
        onSubmit,
    } = props;

    const isEdit = Boolean(data);
    const [isOpen, setIsOpen] = useTaskPriorityModalState();

    const {
        reset,
        control,
        setValue,
        getValues,
        handleSubmit,
        formState: { errors },
    } = useForm<FormDataType>({
        defaultValues: {
            id: null,
            icon: '',
            name: '',
            color: '#000000',
            description: '',
            ...data,
            workspace_id: workspaceId,
        }
    });

    const formValues = getValues();

    useEffect(() => {
        if (data) {
            setValue('id', data.id);
            setValue('name', data.name);
            setValue('icon', data.icon);
            setValue('color', data.color);
            setValue('description', data.description);
        }
    }, [isOpen]);

    const handleClose = () => {
        setIsOpen(false);
        reset();
    };

    return (
        <Card className="w-full p-4 h-full border-none shadow-none overflow-y-auto">
            <CardHeader className="flex mb-4">
                <DialogTitle className="text-xl font-bold">
                    {isEdit ? "Edit Task Priority" : "Create Task Priority"}
                </DialogTitle>
            </CardHeader>
            <div className="mb-4">
                <DottedSeparator />
            </div>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-2 mb-4">
                        <Label htmlFor="priorityName">Priority Name</Label>
                        <Controller
                            name="name"
                            control={control}
                            rules={{ required: { value: true, message: 'Field is required' } }}
                            render={({ field }) => (
                                <Input id="priorityName" {...field} />
                            )}
                        />
                        {errors.name && (<ErrorMessage>{errors.name.message}</ErrorMessage>)}
                    </div>
                    <div className="space-y-2 mb-2">
                        <Label htmlFor="priorityDescription">Description</Label>
                        <Controller
                            name="description"
                            control={control}
                            rules={{ required: { value: true, message: 'Field is required' } }}
                            render={({ field }) => (
                                <Textarea id="priorityDescription" {...field} />
                            )}
                        />
                        {errors.description && (<ErrorMessage>{errors.description.message}</ErrorMessage>)}
                    </div>
                    <IconForm
                        control={control}
                        icon={formValues.icon}
                        color={formValues.color}
                    />
                    <DottedSeparator className="my-4" />
                    <div className="flex items-center justify-between">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={handleClose}
                        >
                            Cancel
                        </Button>
                        <Button type="submit">
                            {isEdit ? "Update Priority" : "Create Priority"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
})

export const TasksPriorityModal = memo((props: TasksPriorityModalProps) => {
    const [isOpen, setIsOpen] = useTaskPriorityModalState();

    return (
        <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
            <TasksPriorityForm {...props} />
        </ResponsiveModal>
    );
}); 