import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

import { getQueryClient } from "@/lib/react-query";
import { getProject } from "@/features/projects";
import { TaskTypesList } from "@/features/task-types";
import { TaskStatusesList } from "@/features/task-statuses";
import { TaskPrioritiesList } from "@/features/task-priorities";
import { getWorkspaceStatuses, getWorkspacePriorities, getWorkspaceTypes } from "@/features/workspaces/api";
import { View, ViewTitle } from "@/components/ui/view";
import { BackButton } from "@/components/navigation";

import { ProjectForm } from "./clients";

export default async function ProjectSettingsPage(props: { params: Promise<{ projectId: string, workspaceId: string }> }) {
  const params = await props.params;
  const projectId = Number(params.projectId);
  const workspaceId = Number(params.workspaceId);

  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery(getProject(projectId)),
    queryClient.prefetchQuery(getWorkspaceStatuses(workspaceId, projectId)),
    queryClient.prefetchQuery(getWorkspacePriorities(workspaceId, projectId)),
    queryClient.prefetchQuery(getWorkspaceTypes(workspaceId, projectId))
  ]);

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <View>
        <div className='flex items-center justify-start gap-2 mb-5 md:hidden'>
            <BackButton />
            <ViewTitle>Back to project</ViewTitle>
        </div>
        <ProjectForm projectId={projectId} />
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
          <div className="flex flex-col gap-2">
            <TaskStatusesList
              projectId={projectId}
              workspaceId={workspaceId}
            />
          </div>
          <div className="flex flex-col gap-2">
            <TaskPrioritiesList
              projectId={projectId}
              workspaceId={workspaceId}
            />
          </div>
          <div className="flex flex-col gap-2">
            <TaskTypesList
              projectId={projectId}
              workspaceId={workspaceId}
            />
          </div>
        </div>
      </View>
    </HydrationBoundary>
  );
}
