"use client";

import { useParams } from "next/navigation";
import { getNavidationStateKey } from "./utils";
import { NavigationState } from "./constants";
import { WorkspaceSwitcher } from "./WorkspaceSwitcher";
import { MediaQuery } from "./MediaQueryWrapper";


const TopBarComponent = () => {
  const params = useParams();
  const navigationState = getNavidationStateKey(params as Record<string, string>);
  const isHome = navigationState === NavigationState.Home;

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
  return (
    <MediaQuery maxWidth={768}>
      <TopBarComponent />
    </MediaQuery>
  )
};
