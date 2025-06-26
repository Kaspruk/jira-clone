'use client';

import { useParams, useRouter } from "next/navigation";
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
            className="cursor-pointer font-medium"
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
            className="cursor-pointer text-destructive focus:text-destructive"
          >
            <TrashIcon className="size-4 mr-2 stroke-2" />
            Delete project
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
