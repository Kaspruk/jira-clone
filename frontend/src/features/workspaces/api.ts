import { BASE_URL, QueriesKeys } from "@/lib/constants";
import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
    WorkspaceTaskStatusType, 
    WorkspaceTaskPriorityType, 
    WorkspaceTaskTypeType, 
    WorkspaceDashboardData, 
    WorkspaceType 
} from "../types";

export const getWorkspaceStatuses = (workspaceId: number, projectId?: number) => queryOptions<WorkspaceTaskStatusType[]>({
    queryKey: [QueriesKeys.WorkspaceStatuses, workspaceId],
    queryFn: async () => {
        const url = new URL(`${BASE_URL}/workspaces/${workspaceId}/statuses/`)

        if (projectId) {
            url.searchParams.set('project_id', projectId.toString());
        }

        const response = await fetch(url.toString())
        return response.json()
    },
});

export const getWorkspacePriorities = (workspaceId: number, projectId?: number) => queryOptions<WorkspaceTaskPriorityType[]>({
    queryKey: [QueriesKeys.WorkspacePriorities, workspaceId],
    queryFn: async () => {
        const url = new URL(`${BASE_URL}/workspaces/${workspaceId}/priorities/`)

        if (projectId) {
            url.searchParams.set('project_id', projectId.toString());
        }

        const response = await fetch(url.toString())
        return response.json()
    },
});

export const getWorkspaceTypes = (workspaceId: number, projectId?: number) => queryOptions<WorkspaceTaskTypeType[]>({
    queryKey: [QueriesKeys.WorkspaceTypes, workspaceId],
    queryFn: async () => {
        const url = new URL(`${BASE_URL}/workspaces/${workspaceId}/types/`)

        if (projectId) {
            url.searchParams.set('project_id', projectId.toString());
        }

        const response = await fetch(url.toString())
        return response.json()
    },
});

export const getWorkspaces = queryOptions<WorkspaceType[]>({
    queryKey: [QueriesKeys.Workspaces],
    queryFn: async (): Promise<WorkspaceType[]> => {
        try {
            const response = await fetch(`${BASE_URL}/workspaces/`);
            if (!response.ok) {
                throw new Error('Failed to fetch workspaces');
            }
            const workspaces = await response.json();
    
            return workspaces;
        } catch (error) {
            console.error(error);
            return [];
        }
    },
});

export const getWorkspaceDashboardData = queryOptions<{[key: number]: WorkspaceDashboardData}>({
    queryKey: [QueriesKeys.WorkspacesDashboard],
    queryFn: async (): Promise<{[key: number]: WorkspaceDashboardData}> => {
        const response = await fetch(`${BASE_URL}/dashboard/workspaces/`);
        if (!response.ok) {
            throw new Error(`Failed to fetch dashboard data for workspaces`);
        }
        return response.json();
    },
});

export const useCreateWorkspace = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (workspace: Pick<WorkspaceType, 'name' | 'description' | 'owner_id'>) => {
            const response = await fetch(`${BASE_URL}/workspaces/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(workspace),
            });

            if (!response.ok) {
                throw new Error("Failed to create workspace");
            }

            return await response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QueriesKeys.Workspaces] });
            queryClient.invalidateQueries({ queryKey: [QueriesKeys.WorkspacesDashboard] });
        },
    });
};

export const useUpdateWorkspace = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (workspace: Omit<WorkspaceType,  'created_at' | 'updated_at'>) => {
            const { id, ...restWorkspace } = workspace;

            const response = await fetch(`${BASE_URL}/workspaces/${id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(restWorkspace),
            });

            if (!response.ok) {
                throw new Error("Failed to update workspace");
            }

            return await response.json();
        },
        onSuccess: (updatedWorkspace) => {
            queryClient.setQueryData([QueriesKeys.Workspaces], (old: WorkspaceType[]) => {
                return old.map((workspace) => workspace.id === updatedWorkspace.id ? updatedWorkspace : workspace);
            });
            queryClient.invalidateQueries({ queryKey: [QueriesKeys.WorkspacesDashboard] });
        },
    });
};

export const useDeleteWorkspace = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (workspaceId: number) => {
            const response = await fetch(`${BASE_URL}/workspaces/${workspaceId}/`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error("Failed to delete workspace");
            }

            return await response.json();
        },
        onSuccess: (_, workspaceId) => {
            queryClient.setQueryData([QueriesKeys.Workspaces], (old: WorkspaceType[]) => {
                return old.filter((workspace) => workspace.id !== workspaceId);
            });
            queryClient.setQueryData([QueriesKeys.WorkspacesDashboard], (old: {[key: number]: WorkspaceDashboardData}) => {
                const newData = { ...old };
                delete newData[workspaceId];
                return newData;
            });
        },
    });
};
