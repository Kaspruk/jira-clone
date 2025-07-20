'use client';

import { memo, useEffect, useMemo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { QueriesKeys } from '@/lib/constants';

import { ResponsiveModal } from '@/components/ResponsiveModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DialogTitle } from '@/components/ui/dialog';
import { ErrorMessage } from '@/components/ui/error-message';
import { DottedSeparator } from '@/components/DottedSeparator';

import { WorkspaceType } from '../../types';
import { useWorkspaceModalState } from '../hooks';
import { useCreateWorkspace, useUpdateWorkspace } from '../api';
import { useUser } from '../../users/api';

type WorkspaceFormData = Pick<WorkspaceType, 'name' | 'description'>;

type WorkspaceFormProps = {
  onClose: () => void;
};

const WorkspaceForm = memo<WorkspaceFormProps>(({ onClose }) => {
  const queryClient = useQueryClient();
  const [workspaceId] = useWorkspaceModalState();
  const isEdit = workspaceId !== 0;

  const { data: user } = useUser();
  const { mutate: createWorkspace, isPending: isCreating } = useCreateWorkspace();
  const { mutate: updateWorkspace, isPending: isUpdating } = useUpdateWorkspace();
  const isPending = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<WorkspaceFormData>({
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const workspace = useMemo(() => {
    if (!workspaceId) {
      return null;
    }

    const workspaces = queryClient.getQueryData<WorkspaceType[]>([QueriesKeys.Workspaces]);
    return workspaces?.find(workspace => workspace.id === workspaceId);
  }, [workspaceId, queryClient]);

  useEffect(() => {
    if (!workspace) {
      return;
    }

    setValue('name', workspace.name);
    setValue('description', workspace.description);
  }, [workspace]);

  const handleClose = () => {
    if (!isPending) {
      onClose();
      reset();
    }
  };

  const onSubmit = async (data: WorkspaceFormData) => {
    if (isEdit) {
      updateWorkspace({
        id: workspaceId!,
        owner_id: workspace!.owner_id,
        ...data,
      }, {
        onSuccess: handleClose
      });
    } else {
      createWorkspace({
        ...data,
        owner_id: user.id,
      }, {
        onSuccess: handleClose
      });
    }
  };

  return (
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
            {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description', {
                required: { value: true, message: 'Fields is required' },
              })}
            />
            {errors.description && <ErrorMessage>{errors.description.message}</ErrorMessage>}
          </div>
          <DottedSeparator className="my-4" />
          <div className="flex items-center justify-between">
            <Button type="button" variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Submiting' : isEdit ? 'Save' : 'Create workspace'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
});

export const WorkspaceModal = memo(() => {
  const [workspaceId, setIsOpen] = useWorkspaceModalState();
  const isOpen = workspaceId !== null;

  const { isPending: isCreating } = useCreateWorkspace();
  const { isPending: isUpdating } = useUpdateWorkspace();

  const isSubmitting = isCreating || isUpdating;

  const handleClose = useCallback(() => {
    if (!isSubmitting) {
      setIsOpen(null);
    }
  }, [isSubmitting]);

  return (
    <ResponsiveModal open={isOpen} onOpenChange={handleClose}>
      <WorkspaceForm onClose={handleClose} />
    </ResponsiveModal>
  );
});
