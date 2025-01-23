'use client';

import { useRouter } from "next/navigation";
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

import { useDeleteProject } from "../api";

interface TaskActionsProps {
  // id: string;
  projectId: number;
  children: React.ReactNode;
};

export const ProjectActions = ({ projectId, children }: TaskActionsProps) => {
  // const workspaceId = useWorkspaceId();
  const router = useRouter();

  // const { open } = useEditTaskModal();
  
  const [ConfirmDialog, confirm] = useConfirm(
    "Delete project",
    "This action cannot be undone.",
    "destructive"
  );
  const { mutate, isPending } = useDeleteProject();

  const onDelete = async () => {
    const ok = await confirm();
    if (!ok) return;

    mutate(projectId);
  };

  // const onOpenProjectDetail = () => {
  //   router.push(`/projects/${projectId}/tasks/`);
  // };

  const onOpenTask = () => {
    router.push(`/projects/${projectId}/tasks/`);
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
            className="font-medium p-[10px]"
          >
            <LuExternalLink className="size-4 mr-2 stroke-2" />
            Prtoject tasks
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
};
