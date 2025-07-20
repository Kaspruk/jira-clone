import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getServerSession } from "next-auth";

import { getUser } from "@/features/users";
import { getWorkspaceDashboardData, getWorkspaces, WorkspaceModal } from "@/features/workspaces";
import { CreateProjectModal } from "@/features/projects";
import { CreateTaskModal } from "@/features/tasks";
import { ChangePasswordModal } from "@/features/users";
import { Confirm } from "@/components/Confirm";
import { getQueryClient } from "@/lib/react-query";
import { TopBar, Sidebar, BottomBar } from "@/components/navigation";
import { SlideUpContainer } from "@/components/animations";

import { authOptions } from "@/lib/auth";

interface DashboardLayoutProps {
  children: React.ReactNode;
};

export default async function DashboardLayout(props: DashboardLayoutProps) {
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
      <main className="p-3 w-full relative max-md:flex-1 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-[5%] left-[2%] w-64 h-64 bg-primary/8 rounded-full blur-3xl" />
          <div className="absolute bottom-[10%] right-[5%] w-72 h-72 bg-primary/6 rounded-full blur-3xl" />
          <div className="absolute top-[45%] left-[75%] w-56 h-56 bg-primary/7 rounded-full blur-3xl" />
          <div className="absolute top-[20%] left-[60%] w-48 h-48 bg-primary/5 rounded-full blur-2xl" />
          <div className="absolute bottom-[40%] left-[8%] w-44 h-44 bg-primary/6 rounded-full blur-3xl" />
          <div className="absolute top-[70%] right-[25%] w-40 h-40 bg-primary/4 rounded-full blur-2xl" />
          <div className="absolute top-[25%] right-[8%] w-52 h-52 bg-primary/7 rounded-full blur-2xl" />
          <div className="absolute top-[80%] left-[30%] w-60 h-60 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute top-[12%] left-[35%] w-36 h-36 bg-primary/6 rounded-full blur-2xl" />
        </div>
        <SlideUpContainer>
          {props.children}
        </SlideUpContainer>
      </main>
      <BottomBar />
      <WorkspaceModal />
      <CreateProjectModal />
      <CreateTaskModal />
      <ChangePasswordModal />
      <Confirm />
    </HydrationBoundary>
  );
};
