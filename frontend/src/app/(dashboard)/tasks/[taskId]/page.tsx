import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/react-query";
import { TaskDetail, getTask } from "@/features/tasks";
import { View, ViewTitle } from "@/components/ui/view";
import { getProject, getProjects } from "@/features/projects";
import { BackButton } from "@/components/navigation";
import { getUsers } from "@/features/users/api";

export default async function Task({ params }: { params: { taskId: string } }) {
    const data = await params;
    const taskId = Number(data.taskId);

    // Fetch task data on the server using React Query
    const queryClient = getQueryClient();
    const task = await queryClient.ensureQueryData(getTask(taskId));
    const [project] = await Promise.all([
        queryClient.ensureQueryData(getProject(task.project_id)),
        queryClient.prefetchQuery(getUsers),
        queryClient.prefetchQuery(getProjects(task.workspace_id))
    ])
    
    const dehydratedState = dehydrate(queryClient);
    
    return (
        <HydrationBoundary state={dehydratedState}>
            <View>
                <div className="flex items-center gap-2 mb-3 md:hidden">
                    <BackButton />
                    <ViewTitle>Back to tasks</ViewTitle>
                </div>
                <TaskDetail taskId={taskId} workspaceId={project.workspace_id} />
            </View>
        </HydrationBoundary>
    );
}