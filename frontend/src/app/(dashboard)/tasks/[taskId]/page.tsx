import { getQueryClient } from "@/lib/react-query";
import { TaskForm, getTask } from "@/features/tasks";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { View, ViewTitle } from "@/components/ui/view";
import { DottedSeparator } from "@/components/DottedSeparator";

export default async function Task({ params }: { params: { taskId: string } }) {
    const queryClient = getQueryClient();
    
    // Fetch task data on the server using React Query
    const task = await queryClient.fetchQuery(getTask(params.taskId));
    console.log('task', task);
    
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <View>
                <ViewTitle>Edit task</ViewTitle>
                <DottedSeparator className="my-3" />
                <TaskForm data={task} />
            </View>
        </HydrationBoundary>
    );
}