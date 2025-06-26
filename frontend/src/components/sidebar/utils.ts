import { SidebarState } from "./constants";

export const getSidebarStateKey = (params: Record<string, string>) => {
    const isTask = Boolean(params.taskId);
    const isWorkspace = Boolean(params.workspaceId);
    const isProject = isWorkspace && Boolean(params.projectId);
    
    switch (true) {
        case isTask:
            return SidebarState.Task;
        case isWorkspace && isProject:
            return SidebarState.Project;
        case isWorkspace:
            return SidebarState.Workspace;
        default:
            return SidebarState.Home;
    }
}