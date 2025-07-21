"use client";

import { memo } from "react";
import { useRouter } from "next/navigation";
import { HiDotsHorizontal } from "react-icons/hi";
import { AiOutlineEye, AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/hooks/use-confirm";
import { useWorkspaceModalState } from "../hooks";
import { useDeleteWorkspace } from "../api";

interface WorkspaceActionsProps {
  workspaceId: number;
}

export const WorkspaceActions = memo(({ workspaceId }: WorkspaceActionsProps) => {
  const router = useRouter();
  const [_, setWorkspaceId] = useWorkspaceModalState();
  const { mutate: deleteWorkspace, isPending: isDeleting } = useDeleteWorkspace();

  const [ConfirmDialog, confirm] = useConfirm(
    "Delete workspace",
    "This action cannot be undone.",
    "destructive"
  );

  const handleView = () => {
    router.push(`/${workspaceId}/projects`);
  };

  const handleEdit = () => {
    setWorkspaceId(workspaceId);
  };

  const handleDelete = async () => {
    const ok = await confirm();
    if (!ok) return;

    try {
        deleteWorkspace(workspaceId);
    } catch (error) {
        console.error(error);
    }
  };

  return (
    <>
        <ConfirmDialog />
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-muted-foreground/10"
                onClick={(e) => {
                    e.stopPropagation(); // Prevent card click events
                }}
                >
                <HiDotsHorizontal className="h-4 w-4" />
                <span className="sr-only">Open actions menu</span>
                </Button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                    onClick={(e) => {
                        e.stopPropagation();
                        handleView();
                    }}
                    className="cursor-pointer"
                >
                    <AiOutlineEye className="size-4 mr-2 stroke-2" />
                    View
                </DropdownMenuItem>
                
                <DropdownMenuItem
                    onClick={(e) => {
                        e.stopPropagation();
                        handleEdit();
                    }}
                    className="cursor-pointer"
                >
                    <AiOutlineEdit className="size-4 mr-2 stroke-2" />
                    Edit
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem
                    disabled={isDeleting}
                    className="cursor-pointer text-destructive focus:text-destructive"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDelete();
                    }}
                >
                    <AiOutlineDelete className="size-4 mr-2 stroke-2" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </>
    );
}); 