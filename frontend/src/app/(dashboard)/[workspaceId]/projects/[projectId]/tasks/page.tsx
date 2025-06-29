import { getQueryClient } from "@/lib/react-query";
import { getProject } from '@/features/projects/api';
import { BackButton } from "@/components/navigation";
import { View,ViewTitle } from "@/components/ui/view";

import { TasksTable } from "./client";
import { CreateTaskButton } from "./client";


export default async function Tasks(props: { params: { projectId: number } }) {
    const data = await props.params;
    const projectId = Number(data.projectId); 
    const queryClient = getQueryClient();
    const project = await queryClient.ensureQueryData(getProject(projectId));

    return (
        <View>
            <div className='flex items-center gap-2 mb-5'>
                <BackButton />
                <ViewTitle>{project?.name || "Завантаження..."}</ViewTitle>
                <div className="flex-1" />
                <CreateTaskButton />
            </div>
            <TasksTable projectId={projectId} />
        </View>
    )
}