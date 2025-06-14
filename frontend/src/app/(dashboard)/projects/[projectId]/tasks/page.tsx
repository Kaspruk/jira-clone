import { getQueryClient } from "@/lib/react-query";
import { getTasks } from '@/features/tasks/api';

import { TasksTable } from "./client";


export default async function Tasks(props: { params: { projectId: number } }) {
    const data = await props.params;
    const projectId = data.projectId; 
    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(getTasks(projectId));

    return (
        <TasksTable />
    )
}