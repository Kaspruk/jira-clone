import { getQueryClient } from "@/lib/react-query";
import { getProject } from "@/features/projects";
import { getWorkspaceStatuses } from "@/features/workspaces/api";
import { TaskStatusesList } from "@/features/task-statuses";
import { TaskPrioritiesList } from "@/features/task-priorities";
import { TaskTypesList } from "@/features/task-types";

export default async function ProjectSettingsPage(props: {
  params: { projectId: number };
}) {
  const params = await props.params;

  const queryClient = getQueryClient();
  
  const project = await queryClient.fetchQuery(getProject(params.projectId));

  const taskStatuses = await queryClient.fetchQuery(getWorkspaceStatuses(project.workspace_id, params.projectId))
    .catch((error) => {
      console.error(error);
      return [];
    });

  return (
    <div className="flex flex-row gap-4">
      <div className="flex flex-col gap-2 w-1/3">
        <TaskStatusesList
          projectId={params.projectId}
          workspaceId={project.workspace_id}
        />
      </div>
      <div className="flex flex-col gap-2 w-1/3">
        <TaskPrioritiesList
          projectId={params.projectId}
          workspaceId={project.workspace_id}
        />
      </div>
      <div className="flex flex-col gap-2 w-1/3">
        <TaskTypesList
          projectId={params.projectId}
          workspaceId={project.workspace_id}
        />
      </div>
    </div>
  );
}
