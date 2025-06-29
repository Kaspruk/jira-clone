"use client";

import React, { useState, useTransition, useEffect, useCallback } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { arrayMove } from "@dnd-kit/sortable";
import { TaskTypeType, WorkspaceTaskTypeType } from "@/features/types";
import { SortableList } from "@/components/SortableList";
import { getWorkspaceTypes } from "@/features/workspaces/api";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Confirm } from "@/components/Confirm";
import { useUpdateProjectTypesOrder, useSelectProjectType } from "../../projects";
import { useTaskTypeModalState } from "../hooks";
import { TaskTypeModal } from "./TaskTypeModal";
import { TaskTypeListItem } from "./TaskTypeListItem";
import { useCreateTaskType, useRemoveTaskType, useUpdateTaskType } from "../api";

interface TaskTypesListProps {
  projectId: number;
  workspaceId: number;
}

export const TaskTypesList: React.FC<TaskTypesListProps> = (props) => {
    const { projectId, workspaceId } = props;
  
    const { data: originalTypes } = useSuspenseQuery(getWorkspaceTypes(workspaceId, projectId));

    const [isPending, startTransition] = useTransition();
    const [types, setTypes] = useState<WorkspaceTaskTypeType[]>(originalTypes);
    const [_, setIsOpen] = useTaskTypeModalState();
    const [editedTaskType, setEditedTaskType] = useState<WorkspaceTaskTypeType | null>(null);
    const { mutate: updateProjectTypesOrder, isPending: isUpdatingProjectTypesOrder } = useUpdateProjectTypesOrder();
    const { mutate: selectProjectType, isPending: isSelectingProjectType } = useSelectProjectType();
    const { mutate: createTaskType, isPending: isCreatingTaskType } = useCreateTaskType();
    const { mutate: updateTaskType, isPending: isUpdatingTaskType } = useUpdateTaskType();
    const { mutate: removeTaskType, isPending: isRemovingTaskType } = useRemoveTaskType();

    useEffect(() => {
      setTypes(originalTypes);
    }, [originalTypes]);
  
    const disableAllActions = (
      isUpdatingProjectTypesOrder ||
      isSelectingProjectType ||
      isCreatingTaskType ||
      isUpdatingTaskType ||
      isRemovingTaskType
    );
  
    const handleReorder = async (oldIndex: number, newIndex: number) => {
      if (disableAllActions) return;
  
      startTransition(() => {
        setTypes((state) => arrayMove(state, oldIndex, newIndex));
      });
  
      updateProjectTypesOrder(
        {
          oldIndex: oldIndex,
          newIndex: newIndex,
          project_id: projectId,
          workspace_id: workspaceId,
        },
        {
          onError: () => {
            setTypes((state) => arrayMove(state, newIndex, oldIndex));
          },
        }
      );
    };
  
    const handleSelect = (id: number) => (value: boolean) => {
      let oldIndex = 0;
      let newIndex = 0;
  
      setTypes((state) => {
          newIndex = state.length - 1;
          const newTypes = state.map((type, index) => {
              if (type.id === id) {
                  oldIndex = index;
              }
  
              if (type.selected) {
                  newIndex = index + 1;
              }
  
              return {
                  ...type,
                  selected: type.id === id ? value : type.selected
              }
          });
  
          if (!value) {
              newIndex = newIndex - 1;
          }
  
          return arrayMove(newTypes, oldIndex, newIndex);
      });
  
      selectProjectType({
        value: value,
        type_id: id,
        project_id: projectId,
      }, {
          onError: () => {
            setTypes((state) => {
              const newTypes = state.map((type) => ({
                  ...type,
                  selected: type.id === id ? !value : type.selected
              }));
  
              return arrayMove(newTypes, oldIndex, newIndex);
            });
          },
      })
    };

    const handleRemoveTaskType = (id: number) => () => {
      Confirm.onConfirm({
        title: 'Remove Task Type',
        message: 'Are you sure you want to remove this task type?',
      }).then((result) => {
        console.log(result);
        if (result) {
          removeTaskType({
            task_type_id: id,
            workspace_id: workspaceId,
          });
        }
      });
    };

    const handleCreateTaskType = useCallback((data: Omit<TaskTypeType, 'id'> & { id?: TaskTypeType['id'] | null }) => {
      const onSuccess = () => {
        setIsOpen(false);
      };

      if (data.id) {
        updateTaskType(data as TaskTypeType, {
          onSuccess,
        });
      } else {
        createTaskType({ task_type: data, project_id: projectId }, {
          onSuccess,
        });
      }
    }, []);

    const onOpenModalChange = useCallback((isOpen: boolean) => {
      if (!isOpen) {
        setEditedTaskType(null);
      }
    }, []);
  
    return (
      <>
        <div className="flex justify-between items-center">
          <h5 className="sm:text-md text-sm font-bold sm:ml-2">Task Types:</h5>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsOpen(true)}
          >
            <Icon name="add" size={18} />
            <span className="sm:block hidden">
              Add Task Type
            </span>
            <span className="sm:hidden block">
              Add
            </span>
          </Button>
        </div>
        <SortableList<WorkspaceTaskTypeType>
          items={types}
          getIndex={(id) => types.findIndex((type) => type.id === id)}
          onReorder={handleReorder}
          renderItem={(data) => {
            return (
              <TaskTypeListItem
                key={data.id}
                {...data}
                onEdit={() => {
                  setEditedTaskType(data);
                  setIsOpen(true);
                }}
                onSelect={handleSelect(data.id)}
                onRemove={handleRemoveTaskType(data.id)}
              />
            );
          }}
        />
        <TaskTypeModal
          data={editedTaskType}
          workspaceId={workspaceId}
          onSubmit={handleCreateTaskType}
          onOpenChange={onOpenModalChange}
        />
      </>
    );
  }; 