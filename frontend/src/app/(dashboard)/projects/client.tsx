"use client";

import { useCallback, useState } from "react";
import { useRouter } from 'next/navigation'
import { useSuspenseQuery } from "@tanstack/react-query";
import { LuEllipsisVertical as MoreVertical } from "react-icons/lu";


import { getProjects } from '@/features/projects/api';
import { ProjectActions } from "@/features/projects/components/ProjectActions";
import { CreateProjectModal } from "@/features/projects/components/CreateProjectModal";
import { ProjectType } from "@/features/projects/types";

import { Button } from "@/components/ui/button";
import { DataTable, DataTableProps } from "@/components/DataTable2";


export const CreateProjectButton = () => {
    const [openModal, setOpenModal] = useState(false);

    return (
        <>
            <Button variant="primary" size="sm" onClick={() => setOpenModal(true)}>
                Create project
            </Button>
            <CreateProjectModal open={openModal} onOpenChange={setOpenModal} />
        </>
    )
};

export const tableColumns: DataTableProps['columns'] = [
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
                {value}
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
    const router = useRouter();
    const { data } = useSuspenseQuery(getProjects);

    const onRowClick = useCallback((data: ProjectType) => {
        router.push(`projects/${data.id}`);
    }, []);

    return (
        <DataTable
            data={data}
            columns={tableColumns}
            onRowClick={onRowClick}
        />
    )
};
