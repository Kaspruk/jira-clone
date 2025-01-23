import { HydrationBoundary, dehydrate } from '@tanstack/react-query'

import { getQueryClient } from "@/lib/react-query";
import { getTasks } from '@/features/tasks/api';

import { TasksTable } from "./client";


export default async function Tasks(props: { params: { projectId: number } }) {
    console.log('props', props);
    const projectId = props.params.projectId; 
    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(getTasks(projectId));

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <TasksTable />
        </HydrationBoundary>
    )
}