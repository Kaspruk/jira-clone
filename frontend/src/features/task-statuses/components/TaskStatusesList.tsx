"use client";

import React, { useState, useTransition, useEffect, useCallback, memo } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
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

export const TaskStatusesList = memo((props: TaskStatusesListProps) => {
    const { projectId, workspaceId } = props;
  
    const { data: originalStatuses } = useSuspenseQuery(getWorkspaceStatuses(workspaceId, projectId));

    const [, startTransition] = useTransition();
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
  
    const handleSelect = useCallback((id: number) => (value: boolean) => {
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
    }, [selectProjectStatus, projectId, workspaceId]);

    const handleRemoveTaskStatus = useCallback((id: number) => () => {
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
    }, [removeTaskStatus, workspaceId]);

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

    const getIndex = useCallback((id: number) => {
      return statuses.findIndex((status) => status.id === id);
    }, [statuses]);

    const renderItem = useCallback((data: WorkspaceTaskStatusType) => {
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
      )
    }, [handleSelect, handleRemoveTaskStatus]);
  
    return (
      <>
        <div className="flex justify-between items-center">
          <h5 className="sm:text-md text-sm font-bold sm:ml-2">Task Statuses:</h5>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsOpen(true)}
          >
            <Icon name="add" size={18} />
            <span className="sm:block hidden">
              Add Task Status
            </span>
            <span className="sm:hidden block">
              Add
            </span>
          </Button>
        </div>
        <SortableList<WorkspaceTaskStatusType>
          items={statuses}
          getIndex={getIndex}
          onReorder={handleReorder}
          renderItem={renderItem}
        />
        <TasksStatusModal
          data={editedTaskStatus}
          workspaceId={workspaceId}
          onSubmit={handleCreateTaskStatus}
          onOpenChange={onOpenModalChange}
        />
      </>
    );
  });
  