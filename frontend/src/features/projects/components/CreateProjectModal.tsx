import { useForm } from "react-hook-form";
import { ResponsiveModal, type ResponsiveModalProps } from "@/components/ResponsiveModal";
import { DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DottedSeparator } from "@/components/DottedSeparator";

import { useCreateProject } from "../api";

type FormDataType = {
    name: string,
    description: string,
};

export const CreateProjectModal = (props: Omit<ResponsiveModalProps, 'children'>) => {
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

    const { mutate, isPending } = useCreateProject();

    const onSubmit = async (data: FormDataType) => {
        mutate({ ...data, owner_id: 1 }, {
            onSuccess() {
                props.onOpenChange?.(false)
            }
        });
    };

    return (
        <ResponsiveModal {...props}>
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
                            {errors.name && (<Label>{errors.name.message}</Label>)}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                {...register('description', { required: { value: true, message: 'Fields is required' } })}
                            />
                            {errors.description && (<Label className="color-red">{errors.description.message}</Label>)}
                        </div>
                        <DottedSeparator className="my-4" />
                        <div className="flex items-center justify-between">
                            <Button
                                type="button"
                                size="lg"
                                variant="secondary"
                            // onClick={onCancel}
                            // disabled={isPending}
                            // className={cn(!onCancel && "invisible")}
                            >
                                Cancel
                            </Button>
                            <Button
                                // disabled={isPending}
                                type="submit"
                                size="lg"
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