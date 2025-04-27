import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query';
import { BASE_URL, QueriesKeys } from '@/lib/constants';
import { type TaskType } from '../types';

export const getTasks = (projectId: number) => queryOptions<TaskType[]>({
    queryKey: [QueriesKeys.Tasks, projectId],
    queryFn: async () => {
        const response = await fetch(`${BASE_URL}/tasks/?projectId=${projectId}`)
        return response.json()
    },
});

export const getTask = (taskId: string) => queryOptions<TaskType>({
    queryKey: [QueriesKeys.Task, taskId],
    queryFn: async () => {
        const response = await fetch(`${BASE_URL}/tasks/${taskId}/`)
        return response.json()
    },
});

export const useCreateTask = (projectId: number) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<TaskType, Error, Omit<TaskType, 'id' | 'created_at' | 'updated_at'>>({
        mutationFn: async (project) => {
            const response = await fetch(`${BASE_URL}/tasks/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(project),
            });

            if (!response.ok) {
                throw new Error("Failed to create project");
            }

            return await response.json();
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

export const useUpdateTask = (taskId: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<TaskType, Error, TaskType>({
        mutationFn: async (task) => {
            const response = await fetch(`${BASE_URL}/tasks/${taskId}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(task),
            });

            if (!response.ok) {
                throw new Error("Failed to update task");
            }

            return await response.json();
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