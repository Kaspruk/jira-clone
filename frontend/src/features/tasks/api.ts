import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query';
import { QueriesKeys } from '@/lib/constants';
import { type TaskType } from '../types';
import axiosClient, { getAxiosClient } from '@/lib/axios';

export const getTasks = (projectId: number) => queryOptions<TaskType[]>({
    queryKey: [QueriesKeys.Tasks, projectId],
    queryFn: async () => {
        const client = getAxiosClient();
        const response = await client.get(`/tasks/`, { params: { projectId } });
        return response.data;
    },
});

export const getTask = (taskId: number) => queryOptions<TaskType>({
    queryKey: [QueriesKeys.Task, taskId],
    queryFn: async () => {
        const client = getAxiosClient();
        const response = await client.get(`/tasks/${taskId}/`);
        return response.data;
    },
});

type CreateTaskType = Omit<TaskType, 'id' | 'created_at' | 'updated_at' | 'type' | 'status' | 'priority'>;
export const useCreateTask = (projectId: number) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<TaskType, Error, CreateTaskType>({
        mutationFn: async (project) => {
            const response = await axiosClient.post("/tasks/", project);
            return response.data;
        },
        onSuccess: () => {
            //   toast.success("Task created");
            queryClient.invalidateQueries({ queryKey: [QueriesKeys.Tasks, projectId] });
        },
        onError: () => {
            //   toast.error("Failed to create Task");
        }
    }, queryClient);

    return mutation;
};

export const useUpdateTask = (taskId: number) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<TaskType, Error, TaskType>({
        mutationFn: async (task) => {
            const response = await axiosClient.put(`/tasks/${taskId}/`, task);
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.setQueryData([QueriesKeys.Task, taskId], data);
            queryClient.invalidateQueries({ queryKey: [QueriesKeys.Tasks] });
        },
        onError: () => {
            //   toast.error("Failed to update Task");
        }
    }, queryClient);

    return mutation;
};

export const useDeleteTask = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<boolean, Error, number>({
        mutationFn: async (taskId) => {
            const response = await axiosClient.delete(`/tasks/${taskId}/`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QueriesKeys.Tasks] });
        },
        onError: () => {
            //   toast.error("Failed to delete Task");
        }
    }, queryClient);

    return mutation;
};