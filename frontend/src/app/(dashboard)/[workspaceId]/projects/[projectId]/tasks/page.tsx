import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/react-query";
import { getProject } from '@/features/projects/api';
import { BackButton } from "@/components/navigation";
import { View, ViewTitle } from "@/components/ui/view";

import { TasksTable } from "./client";
import { CreateTaskButton } from "./client";

// Робимо сторінку динамічною для підтримки автентифікації
export const dynamic = 'force-dynamic';

export default async function Tasks(props: { params: Promise<{ projectId: string }> }) {
    const data = await props.params;
    const projectId = Number(data.projectId); 

    const queryClient = getQueryClient();
    let project = null;
    
    try {
        project = await queryClient.ensureQueryData(getProject(projectId));
    } catch (error) {
        console.log('Server-side project fetch failed:', error);
        // Дані будуть завантажені на клієнті
    }
    
    const dehydratedState = dehydrate(queryClient);
    
    return (
        <HydrationBoundary state={dehydratedState}>
            <View>
                <div className='flex items-center gap-2 mb-5'>
                    <BackButton />
                    <ViewTitle>{project?.name || 'Loading...'}</ViewTitle>
                    <div className="flex-1" />
                    <CreateTaskButton />
                </div>
                <TasksTable projectId={projectId} />
            </View>
        </HydrationBoundary>
    )
}