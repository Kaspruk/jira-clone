"use client";

import { useCallback } from "react";
import { useParams, useRouter } from 'next/navigation'
import { useSuspenseQuery } from "@tanstack/react-query";
import { LuEllipsisVertical as MoreVertical } from "react-icons/lu";

import { getProjects, useProjectModalState, ProjectActions } from '@/features/projects';
import { ProjectType } from "@/features/types";

import { Button } from "@/components/ui/button";
import { DataTable, DataTableProps } from "@/components/DataTable";
import { HtmlOutput } from "@/components/HtmlOutput";


export const CreateProjectButton = () => {
    const [_, setIsOpen] = useProjectModalState();

    return (
        <Button variant="primary" size="sm" onClick={() => setIsOpen(true)}>
            Create project
        </Button>
    )
};

const tableColumns: DataTableProps['columns'] = [
    {
        key: 'name',
        title: 'Name',
        isSortable: true,
        td: ({ value }) => (
            <DataTable.RowCell>
                {value}
            </DataTable.RowCell>
        )
    },
    {
        key: 'description',
        title: 'Description',
        isSortable: true,
        td: ({ value }) => (
            <DataTable.RowCell>
                <HtmlOutput className="text-muted-foreground line-clamp-1">
                    {value}
                </HtmlOutput>
            </DataTable.RowCell>
        )
    },
    {
        key: 'actions',
        title: '',
        isSortable: true,
        textAlign: 'right',
        td: ({ row }) => (
            <DataTable.RowCell className="text-right">
                <ProjectActions projectId={row.id}>
                    <Button variant="ghost" className="size-8 p-0">
                        <MoreVertical className="size-4" />
                    </Button>
                </ProjectActions>
            </DataTable.RowCell>
        )
    }
];

export const ProjectsTable = () => {
    const params = useParams();
    const workspaceId = Number(params.workspaceId);
    const router = useRouter();
    const { data } = useSuspenseQuery(getProjects(workspaceId));

    const onRowClick = useCallback((data: ProjectType) => {
        router.push(`/${workspaceId}/projects/${data.id}/tasks/`);
    }, [workspaceId]);

    return (
        <DataTable
            data={data}
            columns={tableColumns}
            onRowClick={onRowClick}
        />
    )
};
