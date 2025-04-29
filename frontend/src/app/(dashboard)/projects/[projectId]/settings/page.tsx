import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/react-query";
import {TaskStatuses} from "./clients";
import { getProject } from "@/features/projects";
import { getWorkspaceStatuses } from "@/features/workspaces/api";

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
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TaskStatuses project={project} statuses={taskStatuses} />
    </HydrationBoundary>
  );
}
