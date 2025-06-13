"use client";

import React, { useState, useTransition, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { arrayMove } from "@dnd-kit/sortable";
import { TaskStatusType, WorkspaceTaskStatusType } from "@/features/types";
import { SortableList } from "@/components/SortableList";
import { getWorkspaceStatuses } from "@/features/workspaces/api";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Confirm } from "@/components/Confirm";
import { useUpdateProjectStatusesOrder, useSelectProjectStatus } from "../../projects";
import { useTaskStatusModalState } from "../hooks";
import { TasksStatusModal } from "./TasksStatusModal";
import { TaskStatusListItem } from "./TaskStatusListItem";
import { useCreateTaskStatus, useRemoveTaskStatus, useUpdateTaskStatus } from "../api";

interface TaskStatusesListProps {
  projectId: number;
  workspaceId: number;
}

export const TaskStatusesList: React.FC<TaskStatusesListProps> = (props) => {
    const { projectId, workspaceId } = props;
  
    const { data: originalStatuses = [] } = useQuery(getWorkspaceStatuses(workspaceId, projectId));

    const [isPending, startTransition] = useTransition();
    const [statuses, setStatuses] = useState<WorkspaceTaskStatusType[]>(originalStatuses);
    const [_, setIsOpen] = useTaskStatusModalState();
    const [editedTaskStatus, setEditedTaskStatus] = useState<WorkspaceTaskStatusType | null>(null);
    const { mutate: updateProjectStatusesOrder, isPending: isUpdatingProjectStatusesOrder } = useUpdateProjectStatusesOrder();
    const { mutate: selectProjectStatus, isPending: isSelectingProjectStatus } = useSelectProjectStatus();
    const { mutate: createTaskStatus, isPending: isCreatingTaskStatus } = useCreateTaskStatus();
    const { mutate: updateTaskStatus, isPending: isUpdatingTaskStatus } = useUpdateTaskStatus();
    const { mutate: removeTaskStatus, isPending: isRemovingTaskStatus } = useRemoveTaskStatus();

    useEffect(() => {
      setStatuses(originalStatuses);
    }, [originalStatuses]);
  
    const disableAllActions = (
      isUpdatingProjectStatusesOrder ||
      isSelectingProjectStatus ||
      isCreatingTaskStatus ||
      isUpdatingTaskStatus ||
      isRemovingTaskStatus
    );
  
    const handleReorder = async (oldIndex: number, newIndex: number) => {
      if (disableAllActions) return;
  
      startTransition(() => {
        setStatuses((state) => arrayMove(state, oldIndex, newIndex));
      });
  
      updateProjectStatusesOrder(
        {
          oldIndex: oldIndex,
          newIndex: newIndex,
          project_id: projectId,
          workspace_id: workspaceId,
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
              newIndex = newIndex - 1;
          }
  
          return arrayMove(newStatuses, oldIndex, newIndex);
      });
  
      selectProjectStatus({
        value: value,
        status_id: id,
        project_id: projectId,
        workspace_id: workspaceId,
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

    const handleRemoveTaskStatus = (id: number) => () => {
      Confirm.onConfirm({
        title: 'Remove Task Status',
        message: 'Are you sure you want to remove this task status?',
      }).then((result) => {
        console.log(result);
        if (result) {
          removeTaskStatus({
            task_status_id: id,
            workspace_id: workspaceId,
          });
        }
      });
    };

    const handleCreateTaskStatus = useCallback((data: Omit<TaskStatusType, 'id'> & { id?: TaskStatusType['id'] | null }) => {
      const onSuccess = () => {
        setIsOpen(false);
      };

      if (data.id) {
        updateTaskStatus(data as TaskStatusType, {
          onSuccess,
        });
      } else {
        createTaskStatus({ task_status: data, project_id: projectId }, {
          onSuccess,
        });
      }
    }, []);

    const onOpenModalChange = useCallback((isOpen: boolean) => {
      if (!isOpen) {
        setEditedTaskStatus(null);
      }
    }, []);
  
    return (
      <>
        <div className="flex justify-between items-center">
          <h5 className="text-md font-bold ml-2">Task Statuses:</h5>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsOpen(true)}
          >
            <Icon name="add" size={18} />
            Add Task Status
          </Button>
        </div>
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
                onRemove={handleRemoveTaskStatus(data.id)}
              />
            );
          }}
        />
        <TasksStatusModal
          data={editedTaskStatus}
          workspaceId={workspaceId}
          onSubmit={handleCreateTaskStatus}
          onOpenChange={onOpenModalChange}
        />
      </>
    );
  };
  