import { getQueryClient } from "@/lib/react-query";
import { TaskDetail, getTask } from "@/features/tasks";
import { View } from "@/components/ui/view";
import { getProject } from "@/features/projects";

export default async function Task({ params }: { params: { taskId: string } }) {
    const data = await params;
    const taskId = Number(data.taskId);

    // Fetch task data on the server using React Query
    const queryClient = getQueryClient();
    const task = await queryClient.ensureQueryData(getTask(taskId));
    const project = await queryClient.ensureQueryData(getProject(task.project_id));
    
    return (
        <View>
            <TaskDetail taskId={taskId} workspaceId={project.workspace_id} />
        </View>
    );
}