"use client";

import React, { useState, useTransition, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { arrayMove } from "@dnd-kit/sortable";
import { TaskPriorityType, WorkspaceTaskPriorityType } from "@/features/types";
import { SortableList } from "@/components/SortableList";
import { getWorkspacePriorities } from "@/features/workspaces/api";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Confirm } from "@/components/Confirm";
import { useUpdateProjectPrioritiesOrder, useSelectProjectPriority } from "../../projects";
import { useTaskPriorityModalState } from "../hooks";
import { TasksPriorityModal } from "./TasksPriorityModal";
import { TaskPriorityListItem } from "./TaskPriorityListItem";
import { useCreateTaskPriority, useRemoveTaskPriority, useUpdateTaskPriority } from "../api";

interface TaskPrioritiesListProps {
  projectId: number;
  workspaceId: number;
}

export const TaskPrioritiesList: React.FC<TaskPrioritiesListProps> = (props) => {
    const { projectId, workspaceId } = props;
  
    const { data: originalPriorities = [] } = useQuery(getWorkspacePriorities(workspaceId, projectId));

    const [isPending, startTransition] = useTransition();
    const [priorities, setPriorities] = useState<WorkspaceTaskPriorityType[]>(originalPriorities);
    const [_, setIsOpen] = useTaskPriorityModalState();
    const [editedTaskPriority, setEditedTaskPriority] = useState<WorkspaceTaskPriorityType | null>(null);
    const { mutate: updateProjectPrioritiesOrder, isPending: isUpdatingProjectPrioritiesOrder } = useUpdateProjectPrioritiesOrder();
    const { mutate: selectProjectPriority, isPending: isSelectingProjectPriority } = useSelectProjectPriority();
    const { mutate: createTaskPriority, isPending: isCreatingTaskPriority } = useCreateTaskPriority();
    const { mutate: updateTaskPriority, isPending: isUpdatingTaskPriority } = useUpdateTaskPriority();
    const { mutate: removeTaskPriority, isPending: isRemovingTaskPriority } = useRemoveTaskPriority();

    useEffect(() => {
      setPriorities(originalPriorities);
    }, [originalPriorities]);
  
    const disableAllActions = (
      isUpdatingProjectPrioritiesOrder ||
      isSelectingProjectPriority ||
      isCreatingTaskPriority ||
      isUpdatingTaskPriority ||
      isRemovingTaskPriority
    );
  
    const handleReorder = async (oldIndex: number, newIndex: number) => {
      if (disableAllActions) return;
  
      startTransition(() => {
        setPriorities((state) => arrayMove(state, oldIndex, newIndex));
      });
  
      updateProjectPrioritiesOrder(
        {
          oldIndex: oldIndex,
          newIndex: newIndex,
          project_id: projectId,
          workspace_id: workspaceId,
        },
        {
          onError: () => {
            setPriorities((state) => arrayMove(state, newIndex, oldIndex));
          },
        }
      );
    };
  
    const handleSelect = (id: number) => (value: boolean) => {
      let oldIndex = 0;
      let newIndex = 0;
  
      setPriorities((state) => {
          newIndex = state.length - 1;
          const newPriorities = state.map((priority, index) => {
              if (priority.id === id) {
                  oldIndex = index;
              }
  
              if (priority.selected) {
                  newIndex = index + 1;
              }
  
              return {
                  ...priority,
                  selected: priority.id === id ? value : priority.selected
              }
          });
  
          if (!value) {
              newIndex = newIndex - 1;
          }
  
          return arrayMove(newPriorities, oldIndex, newIndex);
      });
  
      selectProjectPriority({
        value: value,
        priority_id: id,
        project_id: projectId,
        workspace_id: workspaceId,
      }, {
          onError: () => {
            setPriorities((state) => {
              const newPriorities = state.map((priority) => ({
                  ...priority,
                  selected: priority.id === id ? !value : priority.selected
              }));
  
              return arrayMove(newPriorities, oldIndex, newIndex);
            });
          },
      })
    };

    const handleRemoveTaskPriority = (id: number) => () => {
      Confirm.onConfirm({
        title: 'Remove Task Priority',
        message: 'Are you sure you want to remove this task priority?',
      }).then((result) => {
        console.log(result);
        if (result) {
          removeTaskPriority({
            task_priority_id: id,
            workspace_id: workspaceId,
          });
        }
      });
    };

    const handleCreateTaskPriority = useCallback((data: Omit<TaskPriorityType, 'id'> & { id?: TaskPriorityType['id'] | null }) => {
      const onSuccess = () => {
        setIsOpen(false);
      };

      if (data.id) {
        updateTaskPriority(data as TaskPriorityType, {
          onSuccess,
        });
      } else {
        createTaskPriority({ task_priority: data, project_id: projectId }, {
          onSuccess,
        });
      }
    }, []);

    const onOpenModalChange = useCallback((isOpen: boolean) => {
      if (!isOpen) {
        setEditedTaskPriority(null);
      }
    }, []);
  
    return (
      <>
        <div className="flex justify-between items-center">
          <h5 className="text-md font-bold ml-2">Task Priorities:</h5>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsOpen(true)}
          >
            <Icon name="add" size={18} />
            Add Task Priority
          </Button>
        </div>
        <SortableList<WorkspaceTaskPriorityType>
          items={priorities}
          getIndex={(id) => priorities.findIndex((priority) => priority.id === id)}
          onReorder={handleReorder}
          renderItem={(data) => {
            return (
              <TaskPriorityListItem
                key={data.id}
                {...data}
                onEdit={() => {
                  setEditedTaskPriority(data);
                  setIsOpen(true);
                }}
                onSelect={handleSelect(data.id)}
                onRemove={handleRemoveTaskPriority(data.id)}
              />
            );
          }}
        />
        <TasksPriorityModal
          data={editedTaskPriority}
          workspaceId={workspaceId}
          onSubmit={handleCreateTaskPriority}
          onOpenChange={onOpenModalChange}
        />
      </>
    );
  }; 