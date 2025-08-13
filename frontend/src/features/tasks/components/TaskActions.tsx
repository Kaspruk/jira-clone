'use client';

import { memo } from "react";
import { 
  LuTrash2 as TrashIcon,
  LuExternalLink
} from "react-icons/lu";

// import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

import { useConfirm } from "@/hooks/use-confirm";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HoverPrefetchLink } from "@/components/HoverPrefetchLink";

import { useDeleteTask } from "../api";


interface TaskActionsProps {
  // id: string;
  taskId: number;
  children: React.ReactNode;
};

export const TaskActions = memo(({ taskId, children }: TaskActionsProps) => {
  // const workspaceId = useWorkspaceId();

  // const { open } = useEditTaskModal();
  
  const [ConfirmDialog, confirm] = useConfirm(
    "Delete project",
    "This action cannot be undone.",
    "destructive"
  );
  const { mutate, isPending } = useDeleteTask();

  const onDelete = async () => {
    const ok = await confirm();
    if (!ok) return;

    console.log('taskId', taskId);

    mutate(taskId);
  };

  // const onOpenProjectDetail = () => {
  //   router.push(`/projects/${projectId}/tasks/`);
  // };
  
  return (
    <>
      <ConfirmDialog />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          {children}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem asChild>
            <HoverPrefetchLink
              href={`/tasks/${taskId}`}
              className="flex items-center font-medium p-[10px]"
            >
              <LuExternalLink className="size-4 mr-2 stroke-2" />
              Open task
            </HoverPrefetchLink>
          </DropdownMenuItem>
          {/* <DropdownMenuItem
            onClick={onOpenProject}
            className="font-medium p-[10px]"
          >
            <ExternalLinkIcon className="size-4 mr-2 stroke-2" />
            Open Project
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => open(id)}
            className="font-medium p-[10px]"
          >
            <PencilIcon className="size-4 mr-2 stroke-2" />
            Edit Task
          </DropdownMenuItem> */}
          <DropdownMenuItem
            onClick={onDelete}
            disabled={isPending}
            className="text-amber-700 focus:text-amber-700 font-medium p-[10px]"
          >
            <TrashIcon className="size-4 mr-2 stroke-2" />
            Delete Task
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
});
