import { QueriesKeys } from "@/lib/constants";
import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
    WorkspaceTaskStatusType, 
    WorkspaceTaskPriorityType, 
    WorkspaceTaskTypeType, 
    WorkspaceDashboardData, 
    WorkspaceType 
} from "../types";
import axiosClient from "@/lib/axios";
import { toast } from "sonner";

export const getWorkspaceStatuses = (workspaceId: number, projectId?: number) => queryOptions<WorkspaceTaskStatusType[]>({
    queryKey: [QueriesKeys.WorkspaceStatuses, workspaceId],
    queryFn: async () => {
        const params = new URLSearchParams();
        if (projectId) {
            params.set('project_id', projectId.toString());
        }

        const response = await axiosClient.get(`/workspaces/${workspaceId}/statuses/`, { params });
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

        const response = await axiosClient.get(`/workspaces/${workspaceId}/priorities/`, { params });
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

        const response = await axiosClient.get(`/workspaces/${workspaceId}/types/`, { params });
        return response.data;
    },
});

export const getWorkspaces = queryOptions<WorkspaceType[]>({
    queryKey: [QueriesKeys.Workspaces],
    queryFn: async (): Promise<WorkspaceType[]> => {
        try {
            const response = await axiosClient.get("/workspaces/");
            return response.data;
        } catch (error) {
            console.error(error);
            return [];
        }
    },
});

export const getWorkspaceDashboardData = queryOptions<{[key: number]: WorkspaceDashboardData}>({
    queryKey: [QueriesKeys.WorkspacesDashboard],
    queryFn: async (): Promise<{[key: number]: WorkspaceDashboardData}> => {
        const response = await axiosClient.get("/dashboard/workspaces/");
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
            queryClient.invalidateQueries({ queryKey: [QueriesKeys.Workspaces] });
            queryClient.invalidateQueries({ queryKey: [QueriesKeys.WorkspacesDashboard] });
        },
        onError: (error) => {
            toast.error(error.message);
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
            queryClient.setQueryData([QueriesKeys.Workspaces], (old: WorkspaceType[]) => {
                return old.map((workspace) => workspace.id === updatedWorkspace.id ? updatedWorkspace : workspace);
            });
            queryClient.invalidateQueries({ queryKey: [QueriesKeys.WorkspacesDashboard] });
        },
        onError: (error) => {
            toast.error(error.message);
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
            toast.error(error.message);
        }
    });
};
