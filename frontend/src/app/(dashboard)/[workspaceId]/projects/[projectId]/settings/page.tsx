
"use client";

import { useParams } from "next/navigation";
import { View } from "@/components/ui/view";
import { TaskStatusesList } from "@/features/task-statuses";
import { TaskPrioritiesList } from "@/features/task-priorities";
import { TaskTypesList } from "@/features/task-types";
import { ProjectForm } from "./clients";

export default function ProjectSettingsPage() {
  const params = useParams();
  const projectId = Number(params.projectId as string);
  const workspaceId = Number(params.workspaceId as string);

  return (
    <View>
      <ProjectForm projectId={projectId} />
      <div className="flex flex-row gap-4 flex-wrap">
        <div className="flex flex-col gap-2 max-sm:w-full w-1/3">
          <TaskStatusesList
            projectId={projectId}
            workspaceId={workspaceId}
          />
        </div>
        <div className="flex flex-col gap-2 max-sm:w-full w-1/3">
          <TaskPrioritiesList
            projectId={projectId}
            workspaceId={workspaceId}
          />
        </div>
        <div className="flex flex-col gap-2 max-sm:w-full w-1/3">
          <TaskTypesList
            projectId={projectId}
            workspaceId={workspaceId}
          />
        </div>
      </div>
    </View>
  );
}
