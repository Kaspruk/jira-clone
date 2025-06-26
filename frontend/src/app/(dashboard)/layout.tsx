import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Sidebar } from "@/components/sidebar";
import { getWorkspaceDashboardData, getWorkspaces, WorkspaceModal } from "@/features/workspaces";
import { CreateProjectModal } from "@/features/projects";
import { CreateTaskModal } from "@/features/tasks";
import { Confirm } from "@/components/Confirm";
import { getQueryClient } from "@/lib/react-query";

interface DashboardLayoutProps {
  children: React.ReactNode;
};

const DashboardLayout = async (props: DashboardLayoutProps) => {
  const queryClient = getQueryClient();
  await queryClient.ensureQueryData(getWorkspaces);
  await queryClient.ensureQueryData(getWorkspaceDashboardData);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Sidebar />
      <main className="p-3 w-full min-h-screen">
        {props.children}
      </main>
      <WorkspaceModal />
      <CreateProjectModal />
      <CreateTaskModal />
      <Confirm />
    </HydrationBoundary>
  );
};

export default DashboardLayout;
