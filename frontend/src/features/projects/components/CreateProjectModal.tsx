'use client';

import { useForm } from "react-hook-form";
import { useParams } from "next/navigation";

import { ResponsiveModal, type ResponsiveModalProps } from "@/components/ResponsiveModal";
import { DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ErrorMessage } from "@/components/ui/error-message";
import { DottedSeparator } from "@/components/DottedSeparator";

import { useCreateProject } from "../api";
import { useProjectModalState } from "../hooks";

type FormDataType = {
    name: string,
    description: string,
};

export const CreateProjectModal = (props: Partial<Omit<ResponsiveModalProps, 'children'>>) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormDataType>({
        defaultValues: {
            name: '',
            description: '',
        }
    });

    const params = useParams();
    const workspaceId = Number(params.workspaceId);

    const [isOpen, setIsOpen] = useProjectModalState();

    const { mutate, isPending } = useCreateProject();

    const onSubmit = async (data: FormDataType) => {
        mutate({
            ...data,
            owner_id: 1,
            workspace_id: workspaceId,
        }, {
            onSuccess() {
                setIsOpen(false);
                props.onOpenChange?.(false)
            }
        });
    };

    return (
        <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
            <Card className="w-full p-4 h-full border-none shadow-none">
                <CardHeader className="flex mb-4">
                    <DialogTitle className="text-xl font-bold">
                        Create a new project
                    </DialogTitle>
                </CardHeader>
                <div className="mb-4">
                    <DottedSeparator />
                </div>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="space-y-2 mb-4">
                            <Label htmlFor="name">Project name</Label>
                            <Input
                                id="name"
                                {...register('name', { required: { value: true, message: 'Fields is required' } })}
                            />
                            {errors.name && (<ErrorMessage>{errors.name.message}</ErrorMessage>)}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                {...register('description', { required: { value: true, message: 'Fields is required' } })}
                            />
                            {errors.description && (<ErrorMessage>{errors.description.message}</ErrorMessage>)}
                        </div>
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
                                {isPending ? "Submiting" : "Create Project"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </ResponsiveModal>
    )
};