"use client";

import { memo } from "react";
import { MenuList } from "./MenuList";
import { useParams, usePathname } from "next/navigation";
import { getNavidationStateKey } from "./utils";
import { NavigationState } from "./constants";
import { cn } from "@/lib/utils";
import { MediaQuery } from "./MediaQueryWrapper";

const BottomBarComponent = memo(() => {
  const params = useParams();
  const pathname = usePathname();
  const navigationState = getNavidationStateKey(params as Record<string, string>, pathname);
  const isHome = navigationState === NavigationState.Home;

  return (
    <footer 
      className={cn(
        "transition-[padding-top] duration-300", 
        isHome ? "pt-0" : "pt-bottom-bar"
      )}
    >
      <div className={
        cn(
          "fixed left-0 right-0 h-bottom-bar p-1.5 border-t border-border bg-background/95 backdrop-blur-sm z-20 transition-[bottom] duration-300",
          "standalone:pb-7 standalone:pt-2 standalone:h-auto standalone:min-h-bottom-bar",
          isHome ? "-bottom-bottom-bar" : "bottom-0"
        )
      }>
        <MenuList isMobile />
      </div>
    </footer>
  );
});

export const BottomBar = () => {
  return (
    <MediaQuery maxWidth={768}>
      <BottomBarComponent />
    </MediaQuery>
  )
};
