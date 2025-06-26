GET_DASHBOARD_WORKSPACES = """
SELECT 
    COALESCE(
        json_object_agg(
            workspaces.id::text,
            json_build_object(
                'projects', CASE 
                    WHEN projects_agg.projects IS NULL THEN '[]'::json 
                    ELSE projects_agg.projects 
                END,
                'total_tasks', COALESCE(projects_agg.total_tasks, 0)
            )
        ),
        '{}'::json
    ) AS workspaces_data
FROM 
    workspaces
LEFT JOIN (
    SELECT 
        workspace_id,
        json_agg(
            json_build_object(
                'id', projects.id,
                'name', projects.name,
                'description', projects.description,
                'owner_id', projects.owner_id,
                'workspace_id', projects.workspace_id,
                'created_at', projects.created_at,
                'task_count', COALESCE(task_counts.task_count, 0)
            ) ORDER BY projects.created_at DESC
        ) AS projects,
        SUM(COALESCE(task_counts.task_count, 0)) AS total_tasks
    FROM projects
    LEFT JOIN (
        SELECT 
            project_id,
            COUNT(*) AS task_count
        FROM tasks
        GROUP BY project_id
    ) task_counts ON projects.id = task_counts.project_id
    GROUP BY workspace_id
) projects_agg ON workspaces.id = projects_agg.workspace_id
"""

GET_DASHBOARD_WORKSPACE_BY_ID = """
SELECT 
    workspaces.id,
    workspaces.name,
    workspaces.description,
    workspaces.owner_id,
    workspaces.created_at,
    CASE 
        WHEN projects_agg.projects IS NULL THEN '[]'::json 
        ELSE projects_agg.projects 
    END AS projects,
    COALESCE(projects_agg.total_tasks, 0) AS total_tasks
FROM workspaces
LEFT JOIN (
    SELECT 
        workspace_id,
        json_agg(
            json_build_object(
                'id', projects.id,
                'name', projects.name,
                'description', projects.description,
                'owner_id', projects.owner_id,
                'workspace_id', projects.workspace_id,
                'created_at', projects.created_at,
                'task_count', COALESCE(task_counts.task_count, 0)
            ) ORDER BY projects.created_at DESC
        ) AS projects,
        SUM(COALESCE(task_counts.task_count, 0)) AS total_tasks
    FROM projects
    LEFT JOIN (
        SELECT 
            project_id,
            COUNT(*) AS task_count
        FROM tasks
        GROUP BY project_id
    ) task_counts ON projects.id = task_counts.project_id
    GROUP BY workspace_id
) projects_agg ON workspaces.id = projects_agg.workspace_id
WHERE workspaces.id = %s
"""

class DashboardSchemes:
    """Клас для організації всіх SQL схем панелі управління"""
    GET_DASHBOARD_WORKSPACES = GET_DASHBOARD_WORKSPACES
    GET_DASHBOARD_WORKSPACE_BY_ID = GET_DASHBOARD_WORKSPACE_BY_ID