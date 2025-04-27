import { useForm } from "react-hook-form";
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
import { TaskStatusType } from "@/features/types";

import { useCreateTaskStatus } from "../api";
import { useTaskStatusModalState } from "../hooks";
import { Controller } from "react-hook-form";
import { useEffect } from "react";

// Define the form data type
type FormDataType = Omit<TaskStatusType, 'id'>;

type TasksStatusModalProps = Partial<Omit<ResponsiveModalProps, 'children'>> & {
    data?: TaskStatusType | null;
    projectId: number;
}

// Create the TasksStatusModal component
export const TasksStatusModal = (props: TasksStatusModalProps) => {
    const {
        data,
        projectId,
    } = props;

    const isEdit = Boolean(data);

    const {
        control,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm<FormDataType>({
        defaultValues: {
            name: '',
            description: '',
            icon: '',
            color: '',
            ...data,
            project_id: projectId,
        }
    });

    useEffect(() => {
        if (data) {
            setValue('name', data.name);
            setValue('description', data.description);
            setValue('icon', data.icon);
            setValue('color', data.color);
        }
    }, [data]);

    const [isOpen, setIsOpen] = useTaskStatusModalState();

    const { mutate, isPending } = useCreateTaskStatus();

    const onSubmit = async (data: FormDataType) => {
        mutate({ ...data, project_id: projectId }, {
            onSuccess() {
                setIsOpen(false);
                props.onOpenChange?.(false);
            }
        });
    };

    return (
        <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
            <Card className="w-full p-4 h-full border-none shadow-none">
                <CardHeader className="flex mb-4">
                    <DialogTitle className="text-xl font-bold">
                        {isEdit ? "Edit Task Status" : "Create Task Status"}
                    </DialogTitle>
                </CardHeader>
                <div className="mb-4">
                    <DottedSeparator />
                </div>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="space-y-2 mb-4">
                            <Label htmlFor="statusName">Status Name</Label>
                            <Controller
                                name="name"
                                control={control}
                                rules={{ required: { value: true, message: 'Field is required' } }}
                                render={({ field }) => (
                                    <Input id="statusName" {...field} />
                                )}
                            />
                            {errors.name && (<ErrorMessage>{errors.name.message}</ErrorMessage>)}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="statusDescription">Description</Label>
                            <Controller
                                name="description"
                                control={control}
                                rules={{ required: { value: true, message: 'Field is required' } }}
                                render={({ field }) => (
                                    <Textarea id="statusDescription" {...field} />
                                )}
                            />
                            {errors.description && (<ErrorMessage>{errors.description.message}</ErrorMessage>)}
                        </div>
                        <IconForm
                            control={control}
                        />
                        <DottedSeparator className="my-4" />
                        <div className="flex items-center justify-between">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => setIsOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isPending}
                            >
                                {isPending ? "Submitting" : isEdit ? "Update Status" : "Create Status"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </ResponsiveModal>
    );
}; 