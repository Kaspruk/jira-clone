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

export const useDeleteProject = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<TaskType['id'], Error, TaskType['id']>({
        mutationFn: async (project_id) => {
            const response = await fetch(`${BASE_URL}/tasks/${project_id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error("Failed to delete project");
            }

            return await response.json();
        },
        onSuccess: (project_id) => {
            //   toast.success("Project deleted");
            queryClient.invalidateQueries({ queryKey: [QueriesKeys.Tasks] });
            queryClient.invalidateQueries({ queryKey: [QueriesKeys.Task, project_id] });
        },
        onError: () => {
            //   toast.error("Failed to delete project");
        }
    }, queryClient);

    return mutation;
};
