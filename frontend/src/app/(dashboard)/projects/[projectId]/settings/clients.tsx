'use client';

import React, { useState } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import { TaskStatusType } from '@/features/types';
import { SortableList } from '@/components/SortableList';
import { TaskStatusListItem, TasksStatusModal } from '@/features/task-statuses';
import { useTaskStatusModalState } from '@/features/task-statuses/hooks';

interface ClientsProps {
    statuses: TaskStatusType[];
}

const mockStatuses: TaskStatusType[] = [
    { id: 1, name: 'Task', description: 'Tasks to be done', icon: 'check_box', color: '#38bdf8', project_id: 1 },
    { id: 2, name: 'History', description: 'Tasks in progress', icon: 'bookmark', color: '#d9f99d', project_id: 1 },
    { id: 3, name: 'Issue', description: 'Completed tasks', icon: 'mode_standby', color: '#f43f5e', project_id: 1 },
    { id: 4, name: 'Epic', description: 'Completed tasks', icon: 'bolt', color: '#818cf8', project_id: 1 },
    { id: 5, name: 'Enhancement', description: 'Completed tasks', icon: 'auto_awesome_motion', color: '#a7f3d0', project_id: 1 },
    { id: 6, name: 'Defect', description: 'Completed tasks', icon: 'bug_report', color: '#f43f5e', project_id: 1 },
];

export const TaskStatuses: React.FC<ClientsProps> = () => {
    const [statuses, setStatuses] = useState<TaskStatusType[]>(mockStatuses.slice(0));

    const [_, setIsOpen] = useTaskStatusModalState();
    const [editedTaskStatus, setEditedTaskStatus] = useState<TaskStatusType | null>(null);

    return (
        <div className="flex flex-col gap-2 w-1/3">
            <h5 className="text-md font-bold ml-2">Project Settings:</h5>
            <SortableList<TaskStatusType>
                items={statuses}
                getIndex={(id) => {
                    return statuses.findIndex((status) => status.id === id);
                }}
                onReorder={(oldIndex, newIndex) => {
                    setStatuses(statuses => arrayMove(statuses, oldIndex, newIndex));
                }}
                renderItem={(data) => {
                    return (
                        <TaskStatusListItem
                            key={data.id}
                            {...data}
                            onEdit={() => {
                                setEditedTaskStatus(data);
                                setIsOpen(true);
                            }}
                        />
                    )
                }}
            />
            <TasksStatusModal
                data={editedTaskStatus}
                projectId={1}
            />
        </div>
    );
}
