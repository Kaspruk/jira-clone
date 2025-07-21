'use client';

import { memo } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  LuTrash2 as TrashIcon,
  LuExternalLink,
  LuSettings
} from "react-icons/lu";

import { useConfirm } from "@/hooks/use-confirm";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useDeleteProject } from "../api";

interface TaskActionsProps {
  projectId: number;
  children: React.ReactNode;
};

export const ProjectActions = memo(({ projectId, children }: TaskActionsProps) => {
  const router = useRouter();
  const params = useParams();
  const workspaceId = Number(params.workspaceId);
  
  const [ConfirmDialog, confirm] = useConfirm(
    "Delete project",
    "This action cannot be undone.",
    "destructive"
  );
  const { mutate, isPending } = useDeleteProject(workspaceId);

  const onDelete = async () => {
    const ok = await confirm();
    if (!ok) return;

    mutate(projectId);
  };

  const onOpenProjectDetail = () => {
    router.push(`/${workspaceId}/projects/${projectId}/settings`);
  };

  const onOpenTask = () => {
    router.push(`/${workspaceId}/projects/${projectId}/tasks`);
  };
  
  return (
    <>
      <ConfirmDialog />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          {children}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={onOpenTask}
            className="cursor-pointer font-medium"
          >
            <LuExternalLink className="size-4 mr-2 stroke-2" />
            Prtoject tasks
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onOpenProjectDetail}
            className="cursor-pointer font-medium"
          >
            <LuSettings className="size-4 mr-2 stroke-2" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onDelete}
            disabled={isPending}
            className="cursor-pointer text-destructive focus:text-destructive"
          >
            <TrashIcon className="size-4 mr-2 stroke-2" />
            Delete project
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
});
