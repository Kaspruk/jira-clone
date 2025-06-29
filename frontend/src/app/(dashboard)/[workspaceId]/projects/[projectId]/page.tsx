import { redirect } from 'next/navigation';

export default async function Project(props: { params: Promise<{ workspaceId: string, projectId: string }>}) {
    const params = await props.params;
    redirect(`/${params.workspaceId}/projects/${params.projectId}/tasks`);
}
