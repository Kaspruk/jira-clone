"use client";

import { memo } from "react";
import { useRouter, useParams } from "next/navigation";
import { RiAddCircleFill } from "react-icons/ri";
import { MdWorkspaces } from "react-icons/md";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { WorkspaceType } from "@/features/types";
import { getWorkspaces, useWorkspaceModalState } from "@/features/workspaces";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

interface WorkspaceSwitcherProps {
    isMobile?: boolean;
    isReadonly?: boolean;
    isCollapsed?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export const WorkspaceSwitcher = memo(({ isMobile = false, isReadonly = false, isCollapsed = false, onOpenChange }: WorkspaceSwitcherProps) => {
    const router = useRouter();
    const params = useParams();
    const currentWorkspaceId = params.workspaceId as string;
    const [_, openWorspaceModal] = useWorkspaceModalState();

    const {data: workspaces} = useQuery(getWorkspaces);

    const currentWorkspace = workspaces?.find(workspace => workspace.id === Number(currentWorkspaceId)) as WorkspaceType;

    const onSelect = (id: string) => {
        router.push(`/${id}`);
    };

    const handleCreateWorkspace = () => {
        openWorspaceModal(0);
    };

    const selectEl = (
        <Select
            value={currentWorkspaceId || ""}
            onOpenChange={onOpenChange}
            onValueChange={onSelect}
        >
            <SelectTrigger 
                variant={(isCollapsed || isReadonly) ? "preview" : "default"}
                className={cn(
                    "bg-muted/50 hover:bg-muted border-border font-medium h-auto transition-all duration-300",
                    isReadonly && "pointer-events-none ml-0",
                    isCollapsed ? "p-0.5 ml-0 w-8 h-8" : "p-1.5",
                    isMobile && "min-w-8 min-h-8"
                )}
            >
                <SelectValue 
                    placeholder={
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <HiOutlineOfficeBuilding className="size-4" />
                            <span>Оберіть workspace</span>
                        </div>
                    }
                >
                    {currentWorkspace && (
                        <WorkspaceDisplay
                            workspace={currentWorkspace}
                            isCollapsed={isCollapsed}
                        />
                    )}
                </SelectValue>
            </SelectTrigger>
            <SelectContent>
                {workspaces?.map((workspace) => (
                    <SelectItem 
                        key={workspace.id} 
                        value={workspace.id.toString()}
                        className="cursor-pointer"
                    >
                        <WorkspaceDisplay workspace={workspace} />
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )

    if (isMobile) {
        return selectEl;
    }

    return (
        <div className={cn(
            "flex flex-col gap-y-3 transition-all duration-300", 
            isCollapsed && "gap-y-0"
        )}>
            <div 
                className={cn(
                    "flex items-center justify-between flex-nowrap transition-opacity duration-300",
                    isCollapsed && "h-0 opacity-0"
                )}
            >
                <div className="flex items-center gap-2">
                    <MdWorkspaces className="size-4 text-muted-foreground" />
                    <p 
                        className={cn(
                            "text-xs font-semibold uppercase text-muted-foreground tracking-wider transition-opacity duration-300",
                            isCollapsed && "max-lg:opacity-0 max-lg:pointer-events-none"
                        )}
                    >
                        Workspace
                    </p>
                </div>
                <RiAddCircleFill
                    title="Створити новий workspace"
                    className={cn(
                        "size-5 text-muted-foreground cursor-pointer hover:text-primary transition-all duration-300",
                        isCollapsed && "max-lg:opacity-0 max-lg:pointer-events-none"
                    )}
                    onClick={handleCreateWorkspace}
                />
            </div>
            {selectEl}
        </div>
    );
});

type WorkspaceDisplayProps = {
    workspace: WorkspaceType;
    isCollapsed?: boolean;
}

const WorkspaceDisplay = ({ workspace, isCollapsed = false }: WorkspaceDisplayProps) => {
    if (!workspace) return null;
    
    return (
        <div className={cn(
            "flex items-center gap-2 transition-all duration-300",
            isCollapsed && "max-lg:justify-center max-lg:gap-0"
        )}>
            <div className={cn(
                "min-w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-semibold",
                isCollapsed && "w-7 min-h-7"
            )}>
                {workspace.name.charAt(0).toUpperCase()}
            </div>
            <div className={cn(
                "flex flex-col text-left",
                isCollapsed && "max-lg:opacity-0 max-lg:pointer-events-none max-lg:w-0 max-lg:overflow-hidden"
            )}>
                <span className="font-medium text-sm">{workspace.name}</span>
                <span className="text-xs text-muted-foreground">{workspace.description}</span>
            </div>
        </div>
    );
};