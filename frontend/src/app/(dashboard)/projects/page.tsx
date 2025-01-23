import { HydrationBoundary, dehydrate } from '@tanstack/react-query'

import { getQueryClient } from "@/lib/react-query";
import { getProjects } from '@/features/projects';

import { View, ViewTitle } from "@/components/ui/view";
import { DottedSeparator } from "@/components/DottedSeparator";
import { CreateProjectButton, ProjectsTable } from "./client";


export default async function Projects() {
    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(getProjects);

    return (
        <View>
            <div className="flex justify-between">
                <ViewTitle>
                    Projects
                </ViewTitle>
                <CreateProjectButton />
            </div>
            <DottedSeparator className="my-3" />
            <HydrationBoundary state={dehydrate(queryClient)}>
                <ProjectsTable />
            </HydrationBoundary>
        </View>
    )
}
