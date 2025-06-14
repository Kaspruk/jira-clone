import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query';
import { TaskStatusType } from '@/features/types';
import { BASE_URL, QueriesKeys } from '@/lib/constants';

// Hook to handle API interaction for creating or updating task statuses
type CreateTaskStatusPayload = {task_status: Omit<TaskStatusType, 'id'>, project_id: number};
export function useCreateTaskStatus(): UseMutationResult<any, Error, CreateTaskStatusPayload> {
    const queryClient = useQueryClient();
    
    return useMutation<any, Error, CreateTaskStatusPayload>({
        mutationFn: async (data: CreateTaskStatusPayload) => {
            const response = await fetch(`${BASE_URL}/task-statuses/${data.project_id}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data.task_status),
            });

            if (!response.ok) {
                throw new Error('Failed to create task status');
            }

            return response.json();
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: [QueriesKeys.WorkspaceStatuses, variables.task_status.workspace_id]
            });
        }
    });
};

export function useUpdateTaskStatus(): UseMutationResult<any, Error, TaskStatusType> {
    const queryClient = useQueryClient();
    
    return useMutation<any, Error, TaskStatusType>({
        mutationFn: async (data: TaskStatusType) => {
            const response = await fetch(`${BASE_URL}/task-statuses/${data.id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to update task status');
            }

            return response.json();
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [QueriesKeys.WorkspaceStatuses, variables.workspace_id] });
        }
    });
};

type RemoveTaskStatusPayload = {
    task_status_id: number;
    workspace_id: number;
}
export function useRemoveTaskStatus(): UseMutationResult<any, Error, RemoveTaskStatusPayload> {
    const queryClient = useQueryClient();
    
    return useMutation<any, Error, RemoveTaskStatusPayload>({
        mutationFn: async (data: RemoveTaskStatusPayload) => {
            const response = await fetch(`${BASE_URL}/task-statuses/${data.task_status_id}/`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to remove task status');
            }

            return response.json();
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [QueriesKeys.WorkspaceStatuses, variables.workspace_id] });
        }
    });
};