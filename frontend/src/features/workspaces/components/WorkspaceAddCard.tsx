"use client";

import { memo } from "react";
import { IoAdd } from "react-icons/io5";
import { Card, CardContent } from "@/components/ui/card";
import { useWorkspaceModalState } from "../hooks";

export const WorkspaceAddCard = memo(() => {
    const [_, setWorkspaceId] = useWorkspaceModalState();

    const handleClick = () => {
        setWorkspaceId(0); // 0 means creating a new workspace
    };

    return (
        <Card 
            className="w-full h-full min-h-[200px] cursor-pointer border-sm border-dashed border-muted-foreground/30 hover:border-primary/50 bg-muted/30 hover:bg-muted/50 card-hover animate-fade-scale"
            onClick={handleClick}
        >
            <CardContent className="flex flex-col items-center justify-center h-full p-6">
                <div className="flex flex-col items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                    <div className="w-12 h-12 rounded-full border-sm border-dashed border-current flex items-center justify-center">
                        <IoAdd className="w-6 h-6" />
                    </div>
                    <div className="text-center">
                        <h3 className="font-medium text-sm">Create Workspace</h3>
                        <p className="text-xs text-muted-foreground/70 mt-1">
                            Add a new workspace to organize your projects
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
});