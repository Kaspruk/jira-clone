import { queryOptions, useQueryClient, useMutation, MutationOptions } from '@tanstack/react-query';
import { BASE_URL, QueriesKeys } from '@/lib/constants';
import { type ProjectType } from '../types';

export const getProjects = queryOptions<ProjectType[]>({
    queryKey: [QueriesKeys.Projects],
    queryFn: async () => {
        const response = await fetch(`${BASE_URL}/projects/`)
        return response.json()
    },
});

export const getProject = (projectId: number) => queryOptions<ProjectType>({
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

type UpdateProjectStatusesOrderType = {
    project_id: number;
    oldIndex: number;
    newIndex: number;
}

export const useUpdateProjectStatusesOrder = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<UpdateProjectStatusesOrderType, Error, UpdateProjectStatusesOrderType>({
        mutationFn: async (data) => {
            const response = await fetch(`${BASE_URL}/projects/${data.project_id}/statuses/order`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ oldIndex: data.oldIndex, newIndex: data.newIndex }),
            });

            if (!response.ok) {
                throw new Error("Failed to update project statuses order");
            }

            return response.json();
        },
        onSuccess: (_, variables) => {
            //   toast.success("Project deleted");
            queryClient.invalidateQueries({ queryKey: [QueriesKeys.Project, variables.project_id] });
        },
    });

    return mutation;
};

type SelectProjectStatus = {
    value: boolean;
    status_id: number;
    project_id: number;
}

export const useSelectProjectStatus = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<SelectProjectStatus, Error, SelectProjectStatus>({
        mutationFn: async (data) => {
            const response = await fetch(`${BASE_URL}/projects/${data.project_id}/statuses/select`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status_id: data.status_id, value: data.value }),
            });

            if (!response.ok) {
                throw new Error("Failed to update project statuses order");
            }

            return response.json();
        },
        onSuccess: (_, variables) => {
            //   toast.success("Project deleted");
            queryClient.invalidateQueries({ queryKey: [QueriesKeys.Project, variables.project_id] });
        },
    });

    return mutation;
};