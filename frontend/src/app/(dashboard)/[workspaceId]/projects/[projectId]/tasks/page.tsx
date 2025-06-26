import { getQueryClient } from "@/lib/react-query";
import { getProject } from '@/features/projects/api';

import { TasksTable } from "./client";
import { View, ViewTitle } from "@/components/ui/view";
import { DottedSeparator } from "@/components/DottedSeparator";
import { CreateTaskButton } from "./client";


export default async function Tasks(props: { params: { projectId: number } }) {
    const data = await props.params;
    const projectId = Number(data.projectId); 
    const queryClient = getQueryClient();
    const project = await queryClient.ensureQueryData(getProject(projectId));

    return (
        <>
            <div className='flex items-center justify-between'>
                <ViewTitle>{project?.name || "Завантаження..."}</ViewTitle>
                <CreateTaskButton />
            </div>
            <DottedSeparator className="my-3" />
            <TasksTable projectId={projectId} />
        </>
    )
}