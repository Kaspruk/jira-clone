import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { TaskStatusType } from '@/features/types';
import { QueriesKeys } from '@/lib/constants';
import axiosClient from '@/lib/axios';

// Hook to handle API interaction for creating or updating task statuses
type CreateTaskStatusPayload = {task_status: Omit<TaskStatusType, 'id'>, project_id: number};
export function useCreateTaskStatus(): UseMutationResult<any, Error, CreateTaskStatusPayload> {
    const queryClient = useQueryClient();
    
    return useMutation<any, Error, CreateTaskStatusPayload>({
        mutationFn: async (data: CreateTaskStatusPayload) => {
            const response = await axiosClient.post(`/task-statuses/${data.project_id}/`, data.task_status);
            return response.data;
        },
        onSuccess: (_, variables) => {
            toast.success("Task status created");
            queryClient.invalidateQueries({
                queryKey: [QueriesKeys.WorkspaceStatuses, variables.task_status.workspace_id]
            });
        },
        onError: () => {
            toast.error("Failed to create task status");
        }
    });
};

export function useUpdateTaskStatus(): UseMutationResult<any, Error, TaskStatusType> {
    const queryClient = useQueryClient();
    
    return useMutation<any, Error, TaskStatusType>({
        mutationFn: async (data: TaskStatusType) => {
            const response = await axiosClient.put(`/task-statuses/${data.id}/`, data);
            return response.data;
        },
        onSuccess: (_, variables) => {
            toast.success("Task status updated");
            queryClient.invalidateQueries({ queryKey: [QueriesKeys.WorkspaceStatuses, variables.workspace_id] });
        },
        onError: () => {
            toast.error("Failed to update task status");
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
            const response = await axiosClient.delete(`/task-statuses/${data.task_status_id}/`);
            return response.data;
        },
        onSuccess: (_, variables) => {
            toast.success("Task status removed");
            queryClient.invalidateQueries({ queryKey: [QueriesKeys.WorkspaceStatuses, variables.workspace_id] });
        },
        onError: () => {
            toast.error("Failed to remove task status");
        }
    });
};