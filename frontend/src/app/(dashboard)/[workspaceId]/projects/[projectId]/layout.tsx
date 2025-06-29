import { getQueryClient } from "@/lib/react-query";
import { getProject } from '@/features/projects';

interface ProjectLayoutProps {
    children: React.ReactNode;
    params: Promise<{ projectId: string }>;
};

export default async function ProjectLayout(props: ProjectLayoutProps) {
    const params = await props.params;
    const queryClient = getQueryClient();
    const projectId = Number(params.projectId);
    await queryClient.ensureQueryData(getProject(projectId));

    return props.children;
}