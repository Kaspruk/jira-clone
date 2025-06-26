"use client";

import { memo } from "react";
import { useParams } from "next/navigation";
import { AnimatePresence } from "motion/react";
import * as motion from "motion/react-client";
import { WorkspaceSwitcher } from "./WorkspaceSwitcher";
import { cn } from "@/lib/utils";
import { MenuList } from "./MenuList";
import { DottedSeparator } from "../DottedSeparator";
import { getSidebarStateKey } from "./utils";
import { SidebarState } from "./constants";

export const Sidebar = memo(() => {
  const params = useParams();
  const sidebarState = getSidebarStateKey(params as Record<string, string>);
  const isHome = sidebarState === SidebarState.Home;


  return (
    <aside
      className={cn(
        "lg:block lg:min-w-aside h-vh overflow-y-auto transition-all duration-300 bg-neutral-50/50 border-r border-neutral-200",
        isHome && "lg:-ml-aside"
      )}
    >
      <div 
        className={cn(
          "fixed left-0 top-0 h-full w-aside pt-10 p-4 transition-[left] duration-300 bg-white shadow-sm",
          isHome && "lg:-left-aside"
        )}
      >
        <div className="flex flex-col h-full">
          {/* WorkspaceSwitcher тільки коли не на домашній сторінці */}
          <AnimatePresence mode="popLayout">
            {sidebarState === SidebarState.Workspace && (
              <motion.div
                key="workspace-switcher"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <WorkspaceSwitcher />
                <DottedSeparator className="my-4" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Основна навігація */}
          <div className="flex-1 overflow-y-auto">
            <MenuList />
          </div>

          {/* Футер сайдбару */}
          <div className="pt-4 border-t border-neutral-200">
            <div className="text-xs text-neutral-400 text-center">
              Jira Clone v1.0
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
});
