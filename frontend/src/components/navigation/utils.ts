import { NavigationState } from "./constants";

export const getNavidationStateKey = (params: Record<string, string>, pathname?: string) => {
    const isTask = Boolean(params.taskId);
    const isWorkspace = Boolean(params.workspaceId);
    const isProject = isWorkspace && Boolean(params.projectId);
    const isProfile = pathname === "/profile";
    
    switch (true) {
        case isTask:
            return NavigationState.Task;
        case isWorkspace && isProject:
            return NavigationState.Project;
        case isWorkspace:
            return NavigationState.Workspace;
        case isProfile:
            return NavigationState.Profile;
        default:
            return NavigationState.Home;
    }
}
