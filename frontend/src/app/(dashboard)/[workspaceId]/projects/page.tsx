import { getQueryClient } from "@/lib/react-query";
import { getProjects } from '@/features/projects';

import { View, ViewTitle } from "@/components/ui/view";
import { DottedSeparator } from "@/components/DottedSeparator";
import { CreateProjectButton, ProjectsTable } from "./client";


export default async function Projects(props: { params: Promise<{ workspaceId: string }> }) {
    const params = await props.params;
    const queryClient = getQueryClient();
    await queryClient.ensureQueryData(getProjects(Number(params.workspaceId)));

    return (
        <View>
            <div className="flex justify-between">
                <ViewTitle>
                    Projects
                </ViewTitle>
                <CreateProjectButton />
            </div>
            <DottedSeparator className="my-3" />
            <ProjectsTable />
        </View>
    )
}
