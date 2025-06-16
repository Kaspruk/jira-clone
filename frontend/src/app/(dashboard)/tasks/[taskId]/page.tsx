import { getQueryClient } from "@/lib/react-query";
import { TaskDetail, getTask } from "@/features/tasks";
import { View } from "@/components/ui/view";

export default async function Task({ params }: { params: { taskId: string } }) {
    const data = await params;

    // Fetch task data on the server using React Query
    const queryClient = getQueryClient();
    await queryClient.fetchQuery(getTask(data.taskId));
    
    return (
        <View>
            <TaskDetail taskId={Number(data.taskId)} />
        </View>
    );
}