import { TaskStatusesList } from "@/features/task-statuses";
import { TaskPrioritiesList } from "@/features/task-priorities";
import { TaskTypesList } from "@/features/task-types";
import { ProjectForm } from "./clients";

export default async function ProjectSettingsPage(props: {
  params: { workspaceId: number, projectId: number };
}) {
  const params = await props.params;
  const projectId = Number(params.projectId);
  const workspaceId = Number(params.workspaceId);

  return (
    <>
      <ProjectForm projectId={projectId} />
      <div className="flex flex-row gap-4">
        <div className="flex flex-col gap-2 w-1/3">
          <TaskStatusesList
            projectId={params.projectId}
            workspaceId={workspaceId}
          />
        </div>
        <div className="flex flex-col gap-2 w-1/3">
          <TaskPrioritiesList
            projectId={params.projectId}
            workspaceId={workspaceId}
          />
        </div>
        <div className="flex flex-col gap-2 w-1/3">
          <TaskTypesList
            projectId={params.projectId}
            workspaceId={workspaceId}
          />
        </div>
      </div>
    </>
  );
}
