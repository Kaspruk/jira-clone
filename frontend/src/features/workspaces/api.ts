import { BASE_URL, QueriesKeys } from "@/lib/constants";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { WorkspaceTaskStatusType } from "../types";

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

export const useGetWorkspaces = () => {
    return useQuery({
        queryKey: ["workspaces"],
        queryFn: async () => {
            const response = await fetch(`${BASE_URL}/workspaces`);
            return response.json();
        },
    });
};