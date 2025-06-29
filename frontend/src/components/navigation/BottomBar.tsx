"use client";

import { MenuList } from "./MenuList";
import { useParams } from "next/navigation";
import { getNavidationStateKey } from "./utils";
import { NavigationState } from "./constants";
import { cn } from "@/lib/utils";
import { MediaQuery } from "./MediaQueryWrapper";

const BottomBarComponent = () => {
  const params = useParams();
  const navigationState = getNavidationStateKey(params as Record<string, string>);
  const isHome = navigationState === NavigationState.Home;

  return (
    <footer 
      className={cn(
        "transition-all duration-300", 
        isHome ? "pt-0" : "pt-bottom-bar"
      )}
    >
      <div className={
        cn(
          "fixed left-0 right-0 h-bottom-bar p-1.5 border-t border-neutral-200 bg-white z-20 transition-all duration-300",
          isHome ? "-bottom-bottom-bar" : "bottom-0"
        )
      }>
        <MenuList isMobile />
      </div>
    </footer>
  );
};
export const BottomBar = () => {
  return (
    <MediaQuery maxWidth={768}>
      <BottomBarComponent />
    </MediaQuery>
  )
};
