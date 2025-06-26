export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!;

export const QueriesKeys = {
    User: 'user',
    Users: 'users',
    Workspaces: 'workspaces',
    WorkspacesDashboard: 'workspacesDashboard',
    WorkspaceTypes: 'workspaceTypes',
    WorkspaceStatuses: 'workspaceStatuses',
    WorkspacePriorities: 'workspacePriorities',
    Projects: 'projects',
    Project: 'project',
    Tasks: 'tasks',
    Task: 'task',
};

export const Routes = {
    Home: '/',
    Projects: '/:workspaceId/projects',
    Project: '/:workspaceId/projects/:projectId/tasks',
    ProjectSettings: '/:workspaceId/projects/:projectId/settings',
};