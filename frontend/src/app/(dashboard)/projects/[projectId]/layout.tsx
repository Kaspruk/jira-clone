import { HydrationBoundary, dehydrate } from '@tanstack/react-query'

import { getQueryClient } from "@/lib/react-query";
import { getProject } from '@/features/projects';

import { View } from "@/components/ui/view";
import { DottedSeparator } from "@/components/DottedSeparator";

import { ProjectTitle } from "./client";

interface ProjectLayoutProps {
    children: React.ReactNode;
    params: Promise<{ projectId: string }>;
};

export default async function ProjectLayout(props: ProjectLayoutProps) {
    const params = await props.params;
    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(getProject(params.projectId));

    return (
        <View>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <ProjectTitle />
                <DottedSeparator className="my-3" />
                {props.children}
            </HydrationBoundary>
        </View>
    )
}