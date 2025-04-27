import { getQueryClient } from "@/lib/react-query";
import { TaskDetail, getTask } from "@/features/tasks";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { View, ViewTitle } from "@/components/ui/view";
import { DottedSeparator } from "@/components/DottedSeparator";

export default async function Task({ params }: { params: { taskId: string } }) {
    const data = await params;

    // Fetch task data on the server using React Query
    const queryClient = getQueryClient();
    const task = await queryClient.fetchQuery(getTask(data.taskId));
    
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <View>
                <TaskDetail data={task} />
            </View>
        </HydrationBoundary>
    );
}