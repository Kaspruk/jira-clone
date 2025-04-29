"use client";

import React, { useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import { ProjectType, WorkspaceTaskStatusType } from "@/features/types";
import { SortableList } from "@/components/SortableList";
import { TaskStatusListItem, TasksStatusModal } from "@/features/task-statuses";
import { useTaskStatusModalState } from "@/features/task-statuses/hooks";
import { useUpdateProjectStatusesOrder, useSelectProjectStatus } from "@/features/projects";

interface ClientsProps {
  project: ProjectType;
  statuses: WorkspaceTaskStatusType[];
}

export const TaskStatuses: React.FC<ClientsProps> = (props) => {
  const { project, statuses: statusesProps } = props;

  const [statuses, setStatuses] = useState<WorkspaceTaskStatusType[]>(statusesProps);
  const [_, setIsOpen] = useTaskStatusModalState();
  const [editedTaskStatus, setEditedTaskStatus] = useState<WorkspaceTaskStatusType | null>(null);
  const { mutate: updateProjectStatusesOrder, isPending: isUpdatingProjectStatusesOrder } = useUpdateProjectStatusesOrder();
  const { mutate: selectProjectStatus, isPending: isSelectingProjectStatus } = useSelectProjectStatus();

  const disableAllActions = isUpdatingProjectStatusesOrder || isSelectingProjectStatus;

  const handleReorder = async (oldIndex: number, newIndex: number) => {
    if (disableAllActions) return;

    setStatuses((state) => arrayMove(state, oldIndex, newIndex));

    updateProjectStatusesOrder(
      {
        project_id: project.id,
        oldIndex: oldIndex,
        newIndex: newIndex,
      },
      {
        onError: () => {
          setStatuses((state) => arrayMove(state, newIndex, oldIndex));
        },
      }
    );
  };

  const handleSelect = (id: number) => (value: boolean) => {
    let oldIndex = 0;
    let newIndex = 0;

    setStatuses((state) => {
        newIndex = state.length - 1;
        const newStatuses = state.map((status, index) => {
            if (status.id === id) {
                oldIndex = index;
            }

            if (status.selected) {
                newIndex = index + 1;
            }

            return {
                ...status,
                selected: status.id === id ? value : status.selected
            }
        });

        if (!value) {
            newIndex = state.length;
        }

        return arrayMove(newStatuses, oldIndex, newIndex);
    });

    selectProjectStatus({
      status_id: id,
      value: value,
      project_id: project.id,
    }, {
        onError: () => {
          setStatuses((state) => {
            const newStatuses = state.map((status) => ({
                ...status,
                selected: status.id === id ? !value : status.selected
            }));

            return arrayMove(newStatuses, oldIndex, newIndex);
          });
        },
    })
  };

  return (
    <div className="flex flex-col gap-2 w-1/3">
      <h5 className="text-md font-bold ml-2">Project Settings:</h5>
      <SortableList<WorkspaceTaskStatusType>
        items={statuses}
        getIndex={(id) => statuses.findIndex((status) => status.id === id)}
        onReorder={handleReorder}
        renderItem={(data) => {
          return (
            <TaskStatusListItem
              key={data.id}
              {...data}
              onEdit={() => {
                setEditedTaskStatus(data);
                setIsOpen(true);
              }}
              onSelect={handleSelect(data.id)}
            />
          );
        }}
      />
      <TasksStatusModal data={editedTaskStatus} projectId={1} />
    </div>
  );
};
