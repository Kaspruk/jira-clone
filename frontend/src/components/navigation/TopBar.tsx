"use client";

import { useMediaQuery } from "react-responsive";
import { useParams } from "next/navigation";
import { getSidebarStateKey } from "./utils";
import { SidebarState } from "./constants";
import { WorkspaceSwitcher } from "./WorkspaceSwitcher";


const TopBarComponent = () => {
  const params = useParams();
  const sidebarState = getSidebarStateKey(params as Record<string, string>);
  const isHome = sidebarState === SidebarState.Home;

  return (
    <header className="pb-top-bar">
      <div className="fixed left-0 right-0 top-0 flex items-center justify-between p-3 h-top-bar border-b border-neutral-200 bg-white z-20">
        <div className="w-8 h-8 rounded-full bg-neutral-300">
        </div>
        {!isHome && (
          <WorkspaceSwitcher isMobile isCollapsed />
        )}
      </div>
    </header>
  );
};

export const TopBar = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  return isMobile ? <TopBarComponent /> : null;
};