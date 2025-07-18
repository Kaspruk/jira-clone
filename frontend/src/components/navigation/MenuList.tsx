"use client";

import { useMemo, memo } from "react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { AnimatePresence } from "motion/react";
import * as motion from "motion/react-client";
import { useQueryClient } from "@tanstack/react-query";

import { buildRoute, cn } from "@/lib/utils";
import { RouteType, RoutesMap, NavigationState } from "./constants";
import { getNavidationStateKey } from "./utils";
import { QueriesKeys, Routes } from "@/lib/constants";
import { TaskType } from "@/features/types";

interface MenuListProps {
  isMobile?: boolean;
  isCollapsed?: boolean;
}

export const MenuList = memo(({ isMobile = false, isCollapsed = false }: MenuListProps) => {
  const params = useParams();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const navigationState = getNavidationStateKey(params as Record<string, string>);
  const isTaskPage = navigationState === NavigationState.Task;

  const menuItems = useMemo(() => {
    let items: RouteType[] = [];

    switch (navigationState) {
        case NavigationState.Task:
          items = [
            RoutesMap[Routes.Home],
            RoutesMap[Routes.Project],
            RoutesMap[Routes.Task],
          ];
          break;
        case NavigationState.Project:
          items = [
            RoutesMap[Routes.Home], 
            RoutesMap[Routes.Workspace], 
            RoutesMap[Routes.Project],
            RoutesMap[Routes.ProjectSettings]
          ];
          break;
          break;
        case NavigationState.Workspace:
          items = [
            RoutesMap[Routes.Home],
            RoutesMap[Routes.Workspace],
          ];
          break;
    }

    return items.map(route => {
      let href = buildRoute(route.href, params as Record<string, string>);

      if (isTaskPage && route.href === Routes.Project) {
        const task = queryClient.getQueryData<TaskType>([QueriesKeys.Task, Number(params.taskId)]);

        if (!task) {
          return;
        }

        href = buildRoute(Routes.Project, {
          projectId: task.project_id.toString(),
          workspaceId: task.workspace_id.toString(),
        });
      }

      const isActive = pathname === href;
      const Icon = isActive ? route.activeIcon : route.icon;

      return (
          <MenuItem
            key={href}
            href={href}
            isActive={isActive}
            isCollapsed={isCollapsed}
            icon={<Icon className={cn("size-5 transition-colors duration-300", !isActive && "text-muted-foreground")} />}
            label={route.label}
            isMobile={isMobile}
          />
      );
    })
  }, [pathname, NavigationState, isCollapsed]);

  return (
    <div className="overflow-hidden w-full">
      <AnimatePresence mode="popLayout">
        <motion.ul
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          className={cn(
            "flex flex-col gap-1",
            isMobile && "flex-row justify-evenly"
          )}
        >
          {menuItems}
        </motion.ul>
      </AnimatePresence>
    </div>
  );
});

type MenuItemProps = {
    href: string;
    isActive?: boolean;
    isCollapsed?: boolean;
    icon: React.ReactNode;
    label: string;
    isMobile?: boolean;
};
  
function MenuItem ({ href, isActive, isCollapsed, icon, label, isMobile = false }: MenuItemProps) {
    return (
        <Link href={href}>
          <div
            className={cn(
              "flex items-center gap-2.5 p-2.5 rounded-lg font-medium transition-all duration-300 text-muted-foreground hover:bg-muted/50 hover:text-foreground whitespace-nowrap",
              isActive && "text-primary hover:text-primary/60",
              (isActive && (!isCollapsed && !isMobile)) && "bg-primary/10 hover:bg-primary/15",
              isCollapsed && "max-lg:pl-1.5",
              isMobile && "max-md:p-1.5 flex-col gap-1"
            )}
            title={label}
          >
            <div className="flex items-center justify-center w-5 h-5">
              {icon}
            </div>
            <span 
              className={cn(
                "transition-opacity duration-300",
                // На планшетах у згорнутому стані ховаємо текст
                isCollapsed && "max-lg:opacity-0 max-lg:pointer-events-none max-lg:w-0 max-lg:overflow-hidden",
                isMobile && "text-xs"
              )}
            >
              {label}
            </span>
          </div>
        </Link>
    );
};