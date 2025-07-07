import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/react-query";
import { getProject } from '@/features/projects';
import { getTasks } from "@/features/tasks";

interface ProjectLayoutProps {
    children: React.ReactNode;
    params: Promise<{ projectId: string }>;
};

export default async function ProjectLayout(props: ProjectLayoutProps) {
    const params = await props.params;
    const projectId = Number(params.projectId);

    const queryClient = getQueryClient();
    await Promise.all([
        queryClient.prefetchQuery(getProject(projectId)),
        queryClient.prefetchQuery(getTasks(projectId))
    ]);
    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            {props.children}
        </HydrationBoundary>
    )
}