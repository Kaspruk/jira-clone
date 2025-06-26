import { redirect } from 'next/navigation';

export default async function Project(props: { params: Promise<{ workspaceId: string }>}) {
    const params = await props.params;
    redirect(`${params.workspaceId}/projects`);
}
