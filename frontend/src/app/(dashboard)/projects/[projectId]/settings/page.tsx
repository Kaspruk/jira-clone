import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/react-query";
import { getTaskStatuses } from "@/features/task-statuses/api";
import {TaskStatuses} from "./clients";

export default async function ProjectSettingsPage(props: {
  params: { projectId: number };
}) {
  const params = await props.params;

  const queryClient = getQueryClient();
  const taskStatuses = await queryClient.fetchQuery(getTaskStatuses(params.projectId)).catch((error) => {
    console.error(error);
    return [];
  });

  console.log(taskStatuses);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TaskStatuses statuses={taskStatuses} />
    </HydrationBoundary>
  );
}
