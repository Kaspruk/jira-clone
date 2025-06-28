import { getQueryClient } from "@/lib/react-query";
import { getProject } from '@/features/projects/api';

import { TasksTable } from "./client";
import { ViewTitle } from "@/components/ui/view";
import { CreateTaskButton } from "./client";


export default async function Tasks(props: { params: { projectId: number } }) {
    const data = await props.params;
    const projectId = Number(data.projectId); 
    const queryClient = getQueryClient();
    const project = await queryClient.ensureQueryData(getProject(projectId));

    return (
        <>
            <div className='flex items-center justify-between mb-5'>
                <ViewTitle>{project?.name || "Завантаження..."}</ViewTitle>
                <CreateTaskButton />
            </div>
            <TasksTable projectId={projectId} />
        </>
    )
}