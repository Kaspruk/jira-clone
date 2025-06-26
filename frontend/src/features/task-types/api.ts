import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query';
import { TaskTypeType } from '@/features/types';
import { BASE_URL, QueriesKeys } from '@/lib/constants';

// Hook to handle API interaction for creating or updating task types
type CreateTaskTypePayload = {task_type: Omit<TaskTypeType, 'id'>, project_id: number};
export function useCreateTaskType(): UseMutationResult<any, Error, CreateTaskTypePayload> {
    const queryClient = useQueryClient();
    
    return useMutation<any, Error, CreateTaskTypePayload>({
        mutationFn: async (data: CreateTaskTypePayload) => {
            const response = await fetch(`${BASE_URL}/task-types/${data.project_id}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data.task_type),
            });

            if (!response.ok) {
                throw new Error('Failed to create task type');
            }

            return response.json();
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: [QueriesKeys.WorkspaceTypes, variables.task_type.workspace_id]
            });
        }
    });
};

export function useUpdateTaskType(): UseMutationResult<any, Error, TaskTypeType> {
    const queryClient = useQueryClient();
    
    return useMutation<any, Error, TaskTypeType>({
        mutationFn: async (data: TaskTypeType) => {
            const response = await fetch(`${BASE_URL}/task-types/${data.id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to update task type');
            }

            return response.json();
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [QueriesKeys.WorkspaceTypes, variables.workspace_id] });
        }
    });
};

type RemoveTaskTypePayload = {
    task_type_id: number;
    workspace_id: number;
}
export function useRemoveTaskType(): UseMutationResult<any, Error, RemoveTaskTypePayload> {
    const queryClient = useQueryClient();
    
    return useMutation<any, Error, RemoveTaskTypePayload>({
        mutationFn: async (data: RemoveTaskTypePayload) => {
            const response = await fetch(`${BASE_URL}/task-types/${data.task_type_id}/`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to remove task type');
            }

            return response.json();
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [QueriesKeys.WorkspaceTypes, variables.workspace_id] });
        }
    });
}; 