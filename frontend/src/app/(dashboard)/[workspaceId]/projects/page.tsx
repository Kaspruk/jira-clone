import { getQueryClient } from "@/lib/react-query";
import { getProjects } from '@/features/projects';

import { View, ViewTitle } from "@/components/ui/view";
import { CreateProjectButton, ProjectsTable } from "./client";


export default async function Projects(props: { params: Promise<{ workspaceId: string }> }) {
    const params = await props.params;
    const queryClient = getQueryClient();
    await queryClient.ensureQueryData(getProjects(Number(params.workspaceId)));

    return (
        <View>
            <div className="flex justify-between mb-5">
                <ViewTitle>
                    Projects
                </ViewTitle>
                <CreateProjectButton />
            </div>
            <ProjectsTable />
        </View>
    )
}
