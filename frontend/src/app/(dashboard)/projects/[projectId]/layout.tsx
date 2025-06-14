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
    await queryClient.fetchQuery(getProject(Number(params.projectId)));

    return (
        <View>
            <ProjectTitle />
            <DottedSeparator className="my-3" />
            {props.children}
        </View>
    )
}