import { getQueryClient } from "@/lib/react-query";
import { getProjects } from '@/features/projects';

import { BackButton } from "@/components/navigation";
import { View, ViewTitle } from "@/components/ui/view";
import { CreateProjectButton, ProjectsTable } from "./client";


export default async function Projects(props: { params: Promise<{ workspaceId: string }> }) {
    const params = await props.params;
    const queryClient = getQueryClient();
    await queryClient.ensureQueryData(getProjects(Number(params.workspaceId)));

    return (
        <View>
            <div className="flex items-center gap-3 mb-5">
                <BackButton />
                <ViewTitle>
                    Projects
                </ViewTitle>
                <div className="flex-1" />
                <CreateProjectButton />
            </div>
            <ProjectsTable />
        </View>
    )
}
