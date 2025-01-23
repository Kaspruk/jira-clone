// import { EditTaskModal } from "@/features/tasks/components/edit-task-modal";
// import { CreateTaskModal } from "@/features/tasks/components/create-task-modal";
// import { CreateProjectModal } from "@/features/projects/components/create-project-modal";
// import { CreateWorkspaceModal } from "@/features/workspaces/components/create-workspace-modal";
// import { usePathname } from "next/navigation";

import { Sidebar } from "@/components/sidebar";
import { CreateProjectModal } from "@/features/projects";
import { CreateTaskModal } from "@/features/tasks";

interface DashboardLayoutProps {
  children: React.ReactNode;
};

const DashboardLayout = async (props: DashboardLayoutProps) => {
  return (
    <>
      <Sidebar />
      <main className="lg:pl-aside p-2 w-full min-h-screen">
        {props.children}
      </main>
      <CreateProjectModal />
      <CreateTaskModal />
      {/* 
        <CreateWorkspaceModal />
        
        <CreateTaskModal />
        <EditTaskModal />
      */}
    </>
  );
};

export default DashboardLayout;
