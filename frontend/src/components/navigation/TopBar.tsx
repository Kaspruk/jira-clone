"use client";

import { memo } from "react";
import { useParams, usePathname } from "next/navigation";
import { getNavidationStateKey } from "./utils";
import { NavigationState } from "./constants";
import { UserPreview } from "@/features/users";
import { WorkspaceSwitcher } from "./WorkspaceSwitcher";
import { MediaQuery } from "./MediaQueryWrapper";


const TopBarComponent = memo(() => {
  const params = useParams();
  const pathname = usePathname();
  const navigationState = getNavidationStateKey(params as Record<string, string>, pathname);
  const isHome = navigationState === NavigationState.Home;
  const isTask = navigationState === NavigationState.Task;
  const isProfile = navigationState === NavigationState.Profile;

  return (
    <header className="pb-top-bar">
      <div className="fixed left-0 right-0 top-0 flex items-center justify-between p-3 h-top-bar border-b border-border bg-background/95 backdrop-blur-sm z-20">
        <UserPreview isCollapsed />
        {!isHome && !isTask && !isProfile && (
          <WorkspaceSwitcher isMobile isCollapsed />
        )}
      </div>
    </header>
  );
});

export const TopBar = () => {
  return (
    <MediaQuery maxWidth={768}>
      <TopBarComponent />
    </MediaQuery>
  )
};
