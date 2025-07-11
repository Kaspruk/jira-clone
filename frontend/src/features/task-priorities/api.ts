import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import axiosClient from '@/lib/axios';
import { TaskPriorityType } from '@/features/types';
import { QueriesKeys } from '@/lib/constants';

// Hook to handle API interaction for creating task priorities
type CreateTaskPriorityPayload = {task_priority: Omit<TaskPriorityType, 'id'>, project_id: number};
export function useCreateTaskPriority(): UseMutationResult<any, Error, CreateTaskPriorityPayload> {
    const queryClient = useQueryClient();
    
    return useMutation<any, Error, CreateTaskPriorityPayload>({
        mutationFn: async (data: CreateTaskPriorityPayload) => {
            const response = await axiosClient.post(`/task-priorities/${data.project_id}/`, data.task_priority);
            return response.data;
        },
        onSuccess: (_, variables) => {
            toast.success("Task priority created");
            queryClient.invalidateQueries({
                queryKey: [QueriesKeys.WorkspacePriorities, variables.task_priority.workspace_id]
            });
        },
        onError: () => {
            toast.error("Failed to create task priority");
        }
    });
};

export function useUpdateTaskPriority(): UseMutationResult<any, Error, TaskPriorityType> {
    const queryClient = useQueryClient();
    
    return useMutation<any, Error, TaskPriorityType>({
        mutationFn: async (data: TaskPriorityType) => {
            const response = await axiosClient.put(`/task-priorities/${data.id}`, data);
            return response.data;
        },
        onSuccess: (_, variables) => {
            toast.success("Task priority updated");
            queryClient.invalidateQueries({ queryKey: [QueriesKeys.WorkspacePriorities, variables.workspace_id] });
        },
        onError: () => {
            toast.error("Failed to update task priority");
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
            const response = await axiosClient.delete(`/task-priorities/${data.task_priority_id}`);
            return response.data;
        },
        onSuccess: (_, variables) => {
            toast.success("Task priority removed");
            queryClient.invalidateQueries({ queryKey: [QueriesKeys.WorkspacePriorities, variables.workspace_id] });
        },
        onError: () => {
            toast.error("Failed to remove task priority");
        }
    });
}; 