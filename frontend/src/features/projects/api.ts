import { queryOptions, useQueryClient, useMutation } from '@tanstack/react-query';
import { QueriesKeys } from '@/lib/constants';
import { type ProjectType } from '../types';
import axiosClient, { getAxiosClient } from '@/lib/axios';

export const getProjects = (workspaceId: number) => queryOptions<ProjectType[]>({
    queryKey: [QueriesKeys.Projects, workspaceId],
    queryFn: async () => {
        const client = getAxiosClient();
        const response = await client.get('/projects/', { params: { workspace_id: workspaceId } });
        return response.data;
    },
});

export const getProject = (projectId: number) => queryOptions<ProjectType>({
    queryKey: [QueriesKeys.Project, projectId],
    queryFn: async () => {
        const client = getAxiosClient();
        const response = await client.get(`/projects/${projectId}/`);
        return response.data;
    },
});

export const useCreateProject = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ProjectType, Error, Omit<ProjectType, 'id' | 'statuses' | 'priorities' | 'types'>>({
        mutationFn: async (project) => {
            const response = await axiosClient.post('/projects/', {
                ...project,
                statuses: [],
                priorities: [],
                types: [],
            });
            return response.data;
        },
        onSuccess: (data) => {
            //   toast.success("Workspace created");
            queryClient.invalidateQueries({ queryKey: [QueriesKeys.WorkspacesDashboard] });
            queryClient.invalidateQueries({ queryKey: [QueriesKeys.Projects, data.workspace_id] });
        },
        onError: () => {
            //   toast.error("Failed to create workspace");
        }
    }, queryClient);

    return mutation;
};

export const useDeleteProject = (workspaceId: number) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ProjectType['id'], Error, ProjectType['id']>({
        mutationFn: async (project_id) => {
            const response = await axiosClient.delete(`/projects/${project_id}`);
            return response.data;
        },
        onSuccess: (project_id) => {
            //   toast.success("Project deleted");
            queryClient.invalidateQueries({ queryKey: [QueriesKeys.Projects, workspaceId] });
            queryClient.invalidateQueries({ queryKey: [QueriesKeys.Project, project_id] });
            queryClient.invalidateQueries({ queryKey: [QueriesKeys.WorkspacesDashboard] });
        },
        onError: () => {
            //   toast.error("Failed to delete project");
        }
    }, queryClient);

    return mutation;
};

export const useUpdateProject = (projectId: number) => {
    const queryClient = useQueryClient();

    return useMutation<ProjectType, Error, ProjectType>({
        mutationFn: async (task) => {
            const response = await axiosClient.put(`/projects/${projectId}/`, task);
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.setQueryData([QueriesKeys.Project, projectId], data);
            queryClient.invalidateQueries({ queryKey: [QueriesKeys.WorkspacesDashboard] });
            queryClient.invalidateQueries({ queryKey: [QueriesKeys.Projects, data.workspace_id] });
        },
        onError: () => {
            //   toast.error("Failed to update Task");
        }
    }, queryClient);
}

type UpdateProjectInstanceOrderType = {
    oldIndex: number;
    newIndex: number;
    project_id: number;
    workspace_id: number;
}

export const useUpdateProjectStatusesOrder = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<UpdateProjectInstanceOrderType, Error, UpdateProjectInstanceOrderType>({
        mutationFn: async (data) => {
            const response = await axiosClient.put(`/projects/${data.project_id}/statuses/order`, { 
                oldIndex: data.oldIndex, 
                newIndex: data.newIndex 
            });
            return response.data;
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
            const response = await axiosClient.put(`/projects/${data.project_id}/statuses/select`, { 
                status_id: data.status_id, 
                value: data.value 
            });
            return response.data;
        },
        onSuccess: (_, variables) => {
            //   toast.success("Project deleted");
            queryClient.invalidateQueries({ queryKey: [QueriesKeys.Project, variables.project_id] });
        },
    });

    return mutation;
};

export const useUpdateProjectPrioritiesOrder = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<UpdateProjectInstanceOrderType, Error, UpdateProjectInstanceOrderType>({
        mutationFn: async (data) => {
            const response = await axiosClient.put(`/projects/${data.project_id}/priorities/order`, { 
                oldIndex: data.oldIndex, 
                newIndex: data.newIndex 
            });
            return response.data;
        },
        onSuccess: (_, variables) => {
            //   toast.success("Project deleted");
            queryClient.invalidateQueries({ queryKey: [QueriesKeys.Project, variables.project_id] });
        },
    });

    return mutation;
};

type SelectProjectPriority = {
    value: boolean;
    priority_id: number;
    project_id: number;
}

export const useSelectProjectPriority = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<SelectProjectPriority, Error, SelectProjectPriority>({
        mutationFn: async (data) => {
            const response = await axiosClient.put(`/projects/${data.project_id}/priorities/select`, { 
                priority_id: data.priority_id, 
                value: data.value 
            });
            return response.data;
        },
        onSuccess: (_, variables) => {
            //   toast.success("Project deleted");
            queryClient.invalidateQueries({ queryKey: [QueriesKeys.Project, variables.project_id] });
        },
    });

    return mutation;
};

export const useUpdateProjectTypesOrder = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<UpdateProjectInstanceOrderType, Error, UpdateProjectInstanceOrderType>({
        mutationFn: async (data) => {
            const response = await axiosClient.put(`/projects/${data.project_id}/types/order`, { 
                oldIndex: data.oldIndex, 
                newIndex: data.newIndex 
            });
            return response.data;
        },
        onSuccess: (_, variables) => {
            //   toast.success("Project deleted");
            queryClient.invalidateQueries({ queryKey: [QueriesKeys.Project, variables.project_id] });
        },
    });

    return mutation;
};

type SelectProjectType = {
    value: boolean;
    type_id: number;
    project_id: number;
}

export const useSelectProjectType = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<SelectProjectType, Error, SelectProjectType>({
        mutationFn: async (data) => {
            const response = await axiosClient.put(`/projects/${data.project_id}/types/select`, { 
                type_id: data.type_id, 
                value: data.value 
            });
            return response.data;
        },
        onSuccess: (_, variables) => {
            //   toast.success("Project deleted");
            queryClient.invalidateQueries({ queryKey: [QueriesKeys.Project, variables.project_id] });
        },
    });

    return mutation;
};