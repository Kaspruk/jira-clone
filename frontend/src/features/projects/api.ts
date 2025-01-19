import { queryOptions, useQueryClient, useMutation } from '@tanstack/react-query';
import { BASE_URL, QueriesKeys } from '@/lib/constants';
import { type ProjectType } from './types';

export const getProjects = queryOptions<ProjectType[]>({
    queryKey: [QueriesKeys.Projects],
    queryFn: async () => {
        const response = await fetch(`${BASE_URL}/projects/`)
        return response.json()
    },
});

export const getProject = (projectId: string) => queryOptions<ProjectType>({
    queryKey: [QueriesKeys.Project, projectId],
    queryFn: async () => {
        const response = await fetch(`${BASE_URL}/projects/${projectId}/`)
        return response.json()
    },
});

export const useCreateProject = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ProjectType, Error, Omit<ProjectType, 'id'>>({
        mutationFn: async (project) => {
            const response = await fetch(`${BASE_URL}/projects/`, {
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
            //   toast.success("Workspace created");
            queryClient.invalidateQueries({ queryKey: [QueriesKeys.Projects] });
        },
        onError: () => {
            //   toast.error("Failed to create workspace");
        }
    }, queryClient);

    return mutation;
};

export const useDeleteProject = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ProjectType['id'], Error, ProjectType['id']>({
        mutationFn: async (project_id) => {
            const response = await fetch(`${BASE_URL}/projects/${project_id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error("Failed to delete project");
            }

            return await response.json();
        },
        onSuccess: (project_id) => {
            //   toast.success("Project deleted");
            queryClient.invalidateQueries({ queryKey: [QueriesKeys.Projects] });
            queryClient.invalidateQueries({ queryKey: [QueriesKeys.Project, project_id] });
        },
        onError: () => {
            //   toast.error("Failed to delete project");
        }
    }, queryClient);

    return mutation;
};

export const useQueryProject = () => {

};