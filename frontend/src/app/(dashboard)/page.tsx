import { getQueryClient } from "@/lib/react-query";
import { getWorkspaceDashboardData, getWorkspaces, WorkspaceAddCard } from "@/features/workspaces";
import { DottedSeparator } from "@/components/DottedSeparator";
import { View, ViewTitle } from "@/components/ui/view";

import { WorkspaceList } from "./client";

export default async function Home() {  
  const queryClient = getQueryClient();
  await queryClient.ensureQueryData(getWorkspaces);
  await queryClient.ensureQueryData(getWorkspaceDashboardData);

  return (
    <View>
      <ViewTitle>Dashboard</ViewTitle>
      <DottedSeparator className="my-3" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <WorkspaceList />
        <WorkspaceAddCard />
      </div>
    </View>
  )
}
