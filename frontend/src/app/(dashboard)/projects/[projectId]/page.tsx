import { redirect } from 'next/navigation';

export default async function Project(props: { params: Promise<{ projectId: string }>}) {
    const params = await props.params;
    redirect(`/projects/${params.projectId}/tasks`);
}
