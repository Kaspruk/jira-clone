'use client';

import { memo, useCallback, useMemo } from "react";
import { useRouter } from 'next/navigation'
import { useSuspenseQuery } from "@tanstack/react-query";
import { LuEllipsisVertical as MoreVertical } from "react-icons/lu";

import { getTasks } from "@/features/tasks/api";
import { ProjectType } from "@/features/types";

import { Button } from "@/components/ui/button";
import { DataTable, DataTableProps } from "@/components/DataTable";
import { TaskActions } from "@/features/tasks/components/TaskActions";
import { getProject } from "@/features/projects";
import { toObject } from "@/lib/utils";
import { useTaskModalState } from "@/features/tasks";

type TasksTableProps = {
    projectId: number;
}

export const TasksTable = memo(({ projectId }: TasksTableProps) => {
    const router = useRouter();
    const { data: project } = useSuspenseQuery(getProject(projectId));
    const { data: tasks } = useSuspenseQuery(getTasks(projectId));

    const onRowClick = useCallback((data: ProjectType) => {
        router.push(`/tasks/${data.id}/`);
    }, []);

    const projectHashData = useMemo(() => {
        return {
            ...project,
            types: toObject(project?.types ?? []),
            statuses: toObject(project?.statuses ?? []),
            priorities: toObject(project?.priorities ?? [])
        };
    }, [project]);

    const columns = useMemo<DataTableProps['columns']>(() => {
        return ([
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
                key: 'type_id',
                title: 'Type',
                isSortable: true,
                td: ({ value }) => (
                    <DataTable.RowCell>
                        {projectHashData.types[value]?.name}
                    </DataTable.RowCell>
                )
            },
            {
                key: 'status_id',
                title: 'Status',
                isSortable: true,
                td: ({ value }) => (
                    <DataTable.RowCell>
                        {projectHashData.statuses[value]?.name}
                    </DataTable.RowCell>
                )
            },
            {
                key: 'priority_id',
                title: 'Priority',
                isSortable: true,
                td: ({ value }) => (
                    <DataTable.RowCell>
                        {projectHashData.priorities[value]?.name}
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
                        <TaskActions taskId={row.id}>
                            <Button variant="ghost" className="size-8 p-0">
                                <MoreVertical className="size-4" />
                            </Button>
                        </TaskActions>
                    </DataTable.RowCell>
                )
            }
        ]);
    }, [tasks]);

    return (
        <DataTable
            data={tasks}
            columns={columns}
            onRowClick={onRowClick}
        />
    )
});

export const CreateTaskButton = () => {
    const [_, setIsOpen] = useTaskModalState();
    return (
        <Button variant="primary" size="sm" onClick={() => setIsOpen(true)}>
            Create task
        </Button>
    )
}
