"use client";

import { useMediaQuery } from "react-responsive";
import { MenuList } from "./MenuList";
import { useParams } from "next/navigation";
import { getSidebarStateKey } from "./utils";
import { SidebarState } from "./constants";
import { cn } from "@/lib/utils";

const BottomBarComponent = () => {
  const params = useParams();
  const sidebarState = getSidebarStateKey(params as Record<string, string>);
  const isHome = sidebarState === SidebarState.Home;

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
  const isMobile = useMediaQuery({ maxWidth: 768 });
  return isMobile ? <BottomBarComponent /> : null;
};