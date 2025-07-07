import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getServerSession } from "next-auth";

import { getUser } from "@/features/users";
import { getWorkspaceDashboardData, getWorkspaces, WorkspaceModal } from "@/features/workspaces";
import { CreateProjectModal } from "@/features/projects";
import { CreateTaskModal } from "@/features/tasks";
import { Confirm } from "@/components/Confirm";
import { getQueryClient } from "@/lib/react-query";
import { TopBar, Sidebar, BottomBar } from "@/components/navigation";

import { authOptions } from "../api/auth/[...nextauth]/route";

interface DashboardLayoutProps {
  children: React.ReactNode;
};

const DashboardLayout = async (props: DashboardLayoutProps) => {
  const session = await getServerSession(authOptions);
  const queryClient = getQueryClient();

  const userId = session?.user?.id;
  
  // Безпечно завантажуємо дані - якщо запити падають, не блокуємо рендеринг
  try {
    await Promise.allSettled([
      userId ? queryClient.prefetchQuery(getUser(Number(userId))) : null,
      queryClient.prefetchQuery(getWorkspaces),
      queryClient.prefetchQuery(getWorkspaceDashboardData),
    ]);
  } catch (error) {
    console.warn("Failed to prefetch data on server:", error);
  }

  // Створюємо dehydrated state після завантаження даних
  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
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
