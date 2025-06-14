import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query';
import { TaskPriorityType } from '@/features/types';
import { BASE_URL, QueriesKeys } from '@/lib/constants';

// Hook to handle API interaction for creating task priorities
type CreateTaskPriorityPayload = {task_priority: Omit<TaskPriorityType, 'id'>, project_id: number};
export function useCreateTaskPriority(): UseMutationResult<any, Error, CreateTaskPriorityPayload> {
    const queryClient = useQueryClient();
    
    return useMutation<any, Error, CreateTaskPriorityPayload>({
        mutationFn: async (data: CreateTaskPriorityPayload) => {
            const response = await fetch(`${BASE_URL}/task-priorities/${data.project_id}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data.task_priority),
            });

            if (!response.ok) {
                throw new Error('Failed to create task priority');
            }

            return response.json();
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: [QueriesKeys.WorkspacePriorities, variables.task_priority.workspace_id]
            });
        }
    });
};

export function useUpdateTaskPriority(): UseMutationResult<any, Error, TaskPriorityType> {
    const queryClient = useQueryClient();
    
    return useMutation<any, Error, TaskPriorityType>({
        mutationFn: async (data: TaskPriorityType) => {
            const response = await fetch(`${BASE_URL}/task-priorities/${data.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to update task priority');
            }

            return response.json();
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [QueriesKeys.WorkspacePriorities, variables.workspace_id] });
        }
    });
};

type RemoveTaskPriorityPayload = {
    task_priority_id: number;
    workspace_id: number;
}
export function useRemoveTaskPriority(): UseMutationResult<any, Error, RemoveTaskPriorityPayload> {
    const queryClient = useQueryClient();
    
    return useMutation<any, Error, RemoveTaskPriorityPayload>({
        mutationFn: async (data: RemoveTaskPriorityPayload) => {
            const response = await fetch(`${BASE_URL}/task-priorities/${data.task_priority_id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to remove task priority');
            }

            return response.json();
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [QueriesKeys.WorkspacePriorities, variables.workspace_id] });
        }
    });
}; 