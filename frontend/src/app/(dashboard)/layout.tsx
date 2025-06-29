import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getWorkspaceDashboardData, getWorkspaces, WorkspaceModal } from "@/features/workspaces";
import { CreateProjectModal } from "@/features/projects";
import { CreateTaskModal } from "@/features/tasks";
import { Confirm } from "@/components/Confirm";
import { getQueryClient } from "@/lib/react-query";
import { TopBar, Sidebar, BottomBar } from "@/components/navigation";

interface DashboardLayoutProps {
  children: React.ReactNode;
};

const DashboardLayout = async (props: DashboardLayoutProps) => {
  const queryClient = getQueryClient();
  
  // Безпечно завантажуємо дані - якщо запити падають, не блокуємо рендеринг
  try {
    await Promise.allSettled([
      queryClient.ensureQueryData(getWorkspaces),
      queryClient.ensureQueryData(getWorkspaceDashboardData)
    ]);
  } catch (error) {
    console.warn("Failed to prefetch data on server:", error);
  }

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
