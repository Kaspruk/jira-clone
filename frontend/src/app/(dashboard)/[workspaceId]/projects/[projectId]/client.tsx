'use client';

import { useParams, useSelectedLayoutSegment, } from 'next/navigation'
import { useSuspenseQuery } from "@tanstack/react-query";

import { getProject } from '@/features/projects';
import { useTaskModalState } from '@/features/tasks';
import { ViewTitle } from "@/components/ui/view";
import { Button } from "@/components/ui/button";

export const ProjectTitle = () => {
    const params = useParams<{ projectId: string }>();
    const segment = useSelectedLayoutSegment();
    const { data } = useSuspenseQuery(getProject(Number(params.projectId)));
    const [_, setIsOpen] = useTaskModalState();

    const isTasksLayout = segment === 'tasks';

    return (
        <div className='flex items-center justify-between'>
            <ViewTitle>{data.name}</ViewTitle>
            {isTasksLayout && (
                <Button variant="primary" size="sm" onClick={() => setIsOpen(true)}>
                    Create task
                </Button>
            )}
        </div>
    )
};
