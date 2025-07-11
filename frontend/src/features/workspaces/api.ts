import { toast } from "sonner";
import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient, { getAxiosClient } from "@/lib/axios";
import { QueriesKeys } from "@/lib/constants";
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
        const params = new URLSearchParams();
        if (projectId) {
            params.set('project_id', projectId.toString());
        }

        const client = getAxiosClient();
        const response = await client.get(`/workspaces/${workspaceId}/statuses/`, { params });
        return response.data;
    },
});

export const getWorkspacePriorities = (workspaceId: number, projectId?: number) => queryOptions<WorkspaceTaskPriorityType[]>({
    queryKey: [QueriesKeys.WorkspacePriorities, workspaceId],
    queryFn: async () => {
        const params = new URLSearchParams();
        if (projectId) {
            params.set('project_id', projectId.toString());
        }

        const client = getAxiosClient();
        const response = await client.get(`/workspaces/${workspaceId}/priorities/`, { params });
        return response.data;
    },
});

export const getWorkspaceTypes = (workspaceId: number, projectId?: number) => queryOptions<WorkspaceTaskTypeType[]>({
    queryKey: [QueriesKeys.WorkspaceTypes, workspaceId],
    queryFn: async () => {
        const params = new URLSearchParams();
        if (projectId) {
            params.set('project_id', projectId.toString());
        }

        const client = getAxiosClient();
        const response = await client.get(`/workspaces/${workspaceId}/types/`, { params });
        return response.data;
    },
});

export const getWorkspaces = queryOptions<WorkspaceType[]>({
    queryKey: [QueriesKeys.Workspaces],
    queryFn: async (): Promise<WorkspaceType[]> => {
        const client = getAxiosClient();
        const response = await client.get("/workspaces/");
        return response.data;
    },
});

export const getWorkspaceDashboardData = queryOptions<{[key: number]: WorkspaceDashboardData}>({
    queryKey: [QueriesKeys.WorkspacesDashboard],
    queryFn: async (): Promise<{[key: number]: WorkspaceDashboardData}> => {
        const client = getAxiosClient();
        const response = await client.get("/dashboard/workspaces/");
        return response.data;
    },
});

export const useCreateWorkspace = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (workspace: Pick<WorkspaceType, 'name' | 'description' | 'owner_id'>) => {
            const response = await axiosClient.post("/workspaces/", workspace);
            return response.data;
        },
        onSuccess: () => {
            toast.success("Workspace created");
            queryClient.invalidateQueries({ queryKey: [QueriesKeys.Workspaces] });
            queryClient.invalidateQueries({ queryKey: [QueriesKeys.WorkspacesDashboard] });
        },
        onError: (error) => {
            toast.error(error.message || "Failed to create workspace");
        }
    });
};

export const useUpdateWorkspace = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (workspace: Omit<WorkspaceType,  'created_at' | 'updated_at'>) => {
            const { id, ...restWorkspace } = workspace;
            const response = await axiosClient.put(`/workspaces/${id}/`, restWorkspace);
            return response.data;
        },
        onSuccess: (updatedWorkspace) => {
            toast.success("Workspace updated");
            queryClient.setQueryData([QueriesKeys.Workspaces], (old: WorkspaceType[]) => {
                return old.map((workspace) => workspace.id === updatedWorkspace.id ? updatedWorkspace : workspace);
            });
            queryClient.invalidateQueries({ queryKey: [QueriesKeys.WorkspacesDashboard] });
        },
        onError: (error) => {
            toast.error(error.message || "Failed to update workspace");
        }
    });
};

export const useDeleteWorkspace = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (workspaceId: number) => {
            const response = await axiosClient.delete(`/workspaces/${workspaceId}/`);
            return response.data;
        },
        onSuccess: (_, workspaceId) => {
            toast.success("Workspace deleted");
            queryClient.setQueryData([QueriesKeys.Workspaces], (old: WorkspaceType[]) => {
                return old.filter((workspace) => workspace.id !== workspaceId);
            });
            queryClient.setQueryData([QueriesKeys.WorkspacesDashboard], (old: {[key: number]: WorkspaceDashboardData}) => {
                const newData = { ...old };
                delete newData[workspaceId];
                return newData;
            });
        },
        onError: (error) => {
            toast.error(error.message || "Failed to delete workspace");
        }
    });
};
