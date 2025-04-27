import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { useQuery, UseQueryResult, queryOptions } from '@tanstack/react-query';
import { TaskStatusType } from '@/features/types';
import { BASE_URL } from '@/lib/constants';


export const getTaskStatuses = (projectId: number) => queryOptions<TaskStatusType[]>({
    queryKey: ['taskStatuses'],
    queryFn: async () => {
        const response = await fetch(`${BASE_URL}/task-statuses/${projectId}/`);

        if (!response.ok) {
            throw new Error('Failed to fetch task statuses');
        }

        return response.json();
    },
});

type CreateTaskStatusData = Omit<TaskStatusType, 'id'>;

// Hook to handle API interaction for creating or updating task statuses
export function useCreateTaskStatus(): UseMutationResult<any, Error, CreateTaskStatusData> {
    return useMutation<any, Error, CreateTaskStatusData>({
        mutationFn: async (data: CreateTaskStatusData) => {
            // Replace with actual API call
            const response = await fetch('/api/task-status', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to create or update task status');
            }

            return response.json();
        }
    });
}
