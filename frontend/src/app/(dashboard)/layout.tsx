import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Sidebar, TopBar, BottomBar } from "@/components/navigation";
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
      <TopBar />
      <Sidebar />
      <main className="p-3 w-full max-md:flex-1">
        {props.children}
      </main>
      <BottomBar />
      <WorkspaceModal />
      <CreateProjectModal />
      <CreateTaskModal />
      <Confirm />
    </HydrationBoundary>
  );
};

export default DashboardLayout;
