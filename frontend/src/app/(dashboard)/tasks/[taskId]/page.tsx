import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/react-query";
import { TaskDetail, getTask } from "@/features/tasks";
import { View, ViewTitle } from "@/components/ui/view";
import { getProject, getProjects } from "@/features/projects";
import { BackButton } from "@/components/navigation";
import { getUsers } from "@/features/users/api";

// Робимо сторінку динамічною для підтримки автентифікації
export const dynamic = 'force-dynamic';

export default async function Task({ params }: { params: Promise<{ taskId: string }> }) {
    const data = await params;
    const taskId = Number(data.taskId);

    const queryClient = getQueryClient();
    let project = null;

    try {
        const task = await queryClient.ensureQueryData(getTask(taskId));
        
        // Prefetch related data
        await Promise.all([
            queryClient.ensureQueryData(getProject(task.project_id)),
            queryClient.prefetchQuery(getUsers),
            queryClient.prefetchQuery(getProjects(task.workspace_id))
        ]);
        
        project = queryClient.getQueryData(getProject(task.project_id).queryKey) || null;
    } catch (error) {
        console.log('Server-side task fetch failed:', error);
        // Дані будуть завантажені на клієнті
    }
    
    const dehydratedState = dehydrate(queryClient);
    
    return (
        <HydrationBoundary state={dehydratedState}>
            <View>
                <div className="flex items-center gap-2 mb-3 md:hidden">
                    <BackButton />
                    <ViewTitle>Back to tasks</ViewTitle>
                </div>
                <TaskDetail taskId={taskId} workspaceId={project?.workspace_id} />
            </View>
        </HydrationBoundary>
    );
}