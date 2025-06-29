import { NavigationState } from "./constants";

export const getNavidationStateKey = (params: Record<string, string>) => {
    const isTask = Boolean(params.taskId);
    const isWorkspace = Boolean(params.workspaceId);
    const isProject = isWorkspace && Boolean(params.projectId);
    
    switch (true) {
        case isTask:
            return NavigationState.Task;
        case isWorkspace && isProject:
            return NavigationState.Project;
        case isWorkspace:
            return NavigationState.Workspace;
        default:
            return NavigationState.Home;
    }
}
