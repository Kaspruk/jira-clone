"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { QueriesKeys } from "@/lib/constants";

import { ResponsiveModal } from "@/components/ResponsiveModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DialogTitle } from "@/components/ui/dialog";
import { ErrorMessage } from "@/components/ui/error-message";
import { DottedSeparator } from "@/components/DottedSeparator";

import { WorkspaceType } from "../../types";
import { useWorkspaceModalState } from "../hooks";
import { useCreateWorkspace, useUpdateWorkspace } from "../api";
import { useUser } from "../../users/api";

type WorkspaceFormData = Pick<WorkspaceType, 'name' | 'description'>;

export const WorkspaceModal = () => {
  const queryClient = useQueryClient();
  const [workspaceId, setIsOpen] = useWorkspaceModalState();
  const isOpen = workspaceId !== null;
  const isEdit = workspaceId !== 0;

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: user } = useUser();
  const { mutate: createWorkspace, isPending: isCreating } = useCreateWorkspace();
  const { mutate: updateWorkspace, isPending: isUpdating } = useUpdateWorkspace();
  const isPending = isCreating || isUpdating;
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm<WorkspaceFormData>({
    defaultValues: {
      name: "",
      description: ""
    }
  });

  const workspace = useMemo(() => {
    if (!workspaceId) {
      return null;
    }

    const workspaces = queryClient.getQueryData<WorkspaceType[]>([QueriesKeys.Workspaces]);
    return workspaces?.find((workspace) => workspace.id === workspaceId);
  }, [workspaceId, queryClient]);

  useEffect(() => {
    if (!workspace) {
      return
    }

    setValue('name', workspace.name);
    setValue('description', workspace.description);
  }, [workspace]);

  const onSubmit = async (data: WorkspaceFormData) => {
    setIsSubmitting(true);
    
    try {
      if (isEdit) {
        await updateWorkspace({
          id: workspaceId!,
          owner_id: workspace!.owner_id,
          ...data
        });
      } else {
        await createWorkspace({
          ...data,
          owner_id: user.id
        });
      }
      
      setIsOpen(null);
      reset();
    } catch (error) {
      console.error("Error saving workspace:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setIsOpen(null);
      reset();
    }
  };

  return (
    <ResponsiveModal open={isOpen} onOpenChange={handleClose}>
        <Card className="w-full p-4 h-full border-none shadow-none overflow-y-auto">
            <CardHeader className="flex mb-4">
                <DialogTitle className="text-xl font-bold">
                  {isEdit ? 'Edit workspace' : 'Create a new workspace'}
                </DialogTitle>
            </CardHeader>
            <div className="mb-4">
                <DottedSeparator />
            </div>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-2 mb-4">
                        <Label htmlFor="name">Name</Label>
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
                            onClick={handleClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isPending}
                        >
                            {isPending ? "Submiting" : isEdit ? "Save" : "Create workspace"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    </ResponsiveModal>
  );
}; 