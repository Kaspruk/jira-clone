import { BASE_URL, QueriesKeys } from "@/lib/constants";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { WorkspaceTaskStatusType, WorkspaceTaskPriorityType, WorkspaceType } from "../types";

export const getWorkspaceStatuses = (workspaceId: number, projectId?: number) => queryOptions<WorkspaceTaskStatusType[]>({
    queryKey: [QueriesKeys.WorkspaceStatuses, workspaceId],
    queryFn: async () => {
        const url = new URL(`${BASE_URL}/workspaces/${workspaceId}/statuses`)

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
        const url = new URL(`${BASE_URL}/workspaces/${workspaceId}/priorities`)

        if (projectId) {
            url.searchParams.set('project_id', projectId.toString());
        }

        const response = await fetch(url.toString())
        return response.json()
    },
});

export const getWorkspaces = queryOptions<WorkspaceType[]>({
    queryKey: [QueriesKeys.Workspaces],
    queryFn: async () => {
        const response = await fetch(`${BASE_URL}/workspaces`);
        return response.json();
    },
});

export const useGetWorkspaces = () => {
    return useQuery(getWorkspaces);
};