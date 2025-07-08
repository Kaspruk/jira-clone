import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query';
import { TaskTypeType } from '@/features/types';
import { QueriesKeys } from '@/lib/constants';
import axiosClient from '@/lib/axios';

// Hook to handle API interaction for creating or updating task types
type CreateTaskTypePayload = {task_type: Omit<TaskTypeType, 'id'>, project_id: number};
export function useCreateTaskType(): UseMutationResult<any, Error, CreateTaskTypePayload> {
    const queryClient = useQueryClient();
    
    return useMutation<any, Error, CreateTaskTypePayload>({
        mutationFn: async (data: CreateTaskTypePayload) => {
            const response = await axiosClient.post(`/task-types/${data.project_id}/`, data.task_type);
            return response.data;
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
            const response = await axiosClient.put(`/task-types/${data.id}/`, data);
            return response.data;
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
            const response = await axiosClient.delete(`/task-types/${data.task_type_id}/`);
            return response.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [QueriesKeys.WorkspaceTypes, variables.workspace_id] });
        }
    });
}; 