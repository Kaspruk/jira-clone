'use client';

import { useParams } from 'next/navigation'
import { useSuspenseQuery } from "@tanstack/react-query";

import { getProject } from '@/features/projects/api';
import { ViewTitle } from "@/components/ui/view";

export const ProjectTitle = () => {
    const params = useParams<{ projectId: string }>();
    const { data } = useSuspenseQuery(getProject(params.projectId));

    return (
        <ViewTitle>{data.name}</ViewTitle>
    )
};