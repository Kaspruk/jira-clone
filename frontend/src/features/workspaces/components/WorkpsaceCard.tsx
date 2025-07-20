"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { HtmlOutput } from "@/components/HtmlOutput";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WorkspaceType } from "@/features/types";

import { WorkspaceActions } from "./WorkspaceActions";
import { getWorkspaceDashboardData } from "../api";

interface WorkspaceCardProps {
  data: WorkspaceType;
}

export const WorkspaceCard = ({ data: workspace }: WorkspaceCardProps) => {
  const router = useRouter();

  const {data: dashboardData, isLoading} = useQuery({
    ...getWorkspaceDashboardData,
    select: (data) => data?.[workspace.id] || null
  });

  const handleProjectClick = (projectId: number) => {
    router.push(`/${workspace.id}/projects/${projectId}/tasks`);
  };

  const handleViewAllProjects = () => {
    router.push(`/${workspace?.id}/projects`);
  };

  return (
    <Card className="w-full p-1 flex flex-col card-hover animate-fade-scale">
      <CardHeader className="mb-3">
        <div className="flex flex-1 items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold">
              {workspace.name}
            </CardTitle>
            {workspace.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {workspace.description}
              </p>
            )}
          </div>
          <WorkspaceActions workspaceId={workspace.id} />
        </div>
      </CardHeader>
      
      <CardContent className="flex-1">
        {isLoading || !dashboardData ? (
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
          </div>
        ) : (dashboardData?.projects?.length ?? 0) > 0 ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-muted-foreground">
                Проекти ({dashboardData.projects?.length ?? 0})
              </h4>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleViewAllProjects}
                className="text-xs h-6 px-2"
              >
                Переглянути всі
              </Button>
            </div>
            {dashboardData.projects?.map((project) => (
              <div
                key={project.id}
                onClick={() => handleProjectClick(project.id)}
                className="flex items-center justify-between p-3 rounded-lg border border-border-sm hover:bg-muted cursor-pointer transition-colors"
              >
                <div className="flex-1">
                  <h5 className="font-medium text-sm">{project.name}</h5>
                  {project.description && (
                    <HtmlOutput className="text-xs text-muted-foreground mt-1 line-clamp-1">
                      {project.description}
                    </HtmlOutput>
                  )}
                </div>
                <Badge variant="secondary" className="ml-3 shrink-0">
                  {project.task_count} {project.task_count === 1 ? 'задача' : 'задач'}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 h-full flex items-center justify-center">
            <p className="text-sm text-muted-foreground">
              У цьому workspace немає проектів
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
