'use client';

import { useCallback } from "react";
import { useRouter, useParams } from 'next/navigation'
import { useSuspenseQuery } from "@tanstack/react-query";
import { LuEllipsisVertical as MoreVertical } from "react-icons/lu";

import { getTasks } from "@/features/tasks/api";
import { ProjectType } from "@/features/types";

import { Button } from "@/components/ui/button";
import { DataTable, DataTableProps } from "@/components/DataTable";

const tableColumns: DataTableProps['columns'] = [
    {
        key: 'title',
        title: 'Title',
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
                {/* <ProjectActions projectId={row.id}>
                    <Button variant="ghost" className="size-8 p-0">
                        <MoreVertical className="size-4" />
                    </Button>
                </ProjectActions> */}
                <Button variant="ghost" className="size-8 p-0">
                    <MoreVertical className="size-4" />
                </Button>
            </DataTable.RowCell>
        )
    }
];

export const TasksTable = () => {
    const router = useRouter();
    const params = useParams();
    const { data } = useSuspenseQuery(getTasks(Number(params.projectId)));

    const onRowClick = useCallback((data: ProjectType) => {
        console.log('onRowClick')
        router.push(`/tasks/${data.id}/`);
    }, []);

    return (
        <DataTable
            data={data}
            columns={tableColumns}
            onRowClick={onRowClick}
        />
    )
};
