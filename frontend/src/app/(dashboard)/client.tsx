"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { getWorkspaces, WorkspaceCard } from "@/features/workspaces";

export const WorkspaceList = () => {
    const { data: workspaces } = useSuspenseQuery(getWorkspaces);

    return workspaces.map((workspace) => (
        <WorkspaceCard 
          key={workspace.id} 
          data={workspace}
        />
    ));
}
