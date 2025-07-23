"use client";

import { memo, useRef, useEffect, useState } from "react";
import { useMediaQuery } from 'react-responsive'
import { useParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { UserPreview } from "@/features/users";

import { DottedSeparator } from "../DottedSeparator";
import { WorkspaceSwitcher } from "./WorkspaceSwitcher";
import { MenuList } from "./MenuList";
import { getNavidationStateKey } from "./utils";
import { NavigationState } from "./constants";
import { MediaQuery } from "./MediaQueryWrapper";

const SidebarComponent = memo(() => {
  const params = useParams();
  const pathname = usePathname();
  
  const isTablet = useMediaQuery({ maxWidth: 1024 });
  const [isHovered, setIsHovered] = useState(() => !isTablet);

  const sidebarRef = useRef<HTMLDivElement>(null);
  const isSwitcherOpen = useRef(false);
  const isMouseOverSidebar = useRef(false);
  
  const navigationState = getNavidationStateKey(params as Record<string, string>, pathname);
  const isHome = navigationState === NavigationState.Home;
  const isTask = navigationState === NavigationState.Task;
  const isProfile = navigationState === NavigationState.Profile;
  const isHomeRef = useRef(false);
  isHomeRef.current = isHome;

  useEffect(() => {
    if (!isHomeRef.current) {
      setIsHovered(!isTablet);
    }
  }, [isTablet]);

  useEffect(() => {
    const sidebarElement = sidebarRef.current;
    if (!sidebarElement) return;

    const handleMouseEnter = () => {
      isMouseOverSidebar.current = true;
      if (isTablet && !isHomeRef.current) {
        setIsHovered(true);
      }
    };

    const handleMouseLeave = () => {
      isMouseOverSidebar.current = false;
      if (isTablet && !isSwitcherOpen.current) {
        setIsHovered(false);
      }
    };

    sidebarElement.addEventListener('mouseenter', handleMouseEnter);
    sidebarElement.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      sidebarElement.removeEventListener('mouseenter', handleMouseEnter);
      sidebarElement.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isTablet]);

  useEffect(() => {
    if (isHome && isTablet) {
      setIsHovered(false);
    }
  }, [isHome, isTablet]);

  const handleOpenChange = (open: boolean) => {
    isSwitcherOpen.current = open;

    if (isTablet && !open && !isMouseOverSidebar.current) {
      setIsHovered(false);
    }
  }

  return (
    <aside
      className={cn(
        "lg:block min-w-aside-md lg:min-w-aside-lg h-vh overflow-y-auto transition-all duration-300",
        isHome && "-ml-aside-md lg:-ml-aside-lg"
      )}
    >
      <div 
        ref={sidebarRef}
        className={cn(
          "fixed top-0 h-full pt-10 p-4 z-20 transition-all duration-300 bg-background overflow-hidden",
          // Базова ширина для планшетів і десктопа
          "w-aside-md lg:w-aside-lg",
          // При hover на планшетах розширюємо до повної ширини
          isHovered && "max-lg:w-aside-lg max-lg:shadow-lg max-lg:z-30",
          isHome && "-left-aside-md lg:-left-aside-lg"
        )}
      >
        <div className="flex flex-col h-full">
          <UserPreview isCollapsed={!isHovered} onOpenChange={handleOpenChange} />
          <DottedSeparator className="my-4" />

          {(!isTask && !isProfile) && (
            <>
              <WorkspaceSwitcher isCollapsed={!isHovered} onOpenChange={handleOpenChange} />
              <DottedSeparator className="my-4" />
            </>
          )}

          {/* Основна навігація */}
          <div className="flex-1 overflow-y-auto">
            <MenuList isCollapsed={!isHovered} />
          </div>

          {/* Футер сайдбару */}
          <div className="pt-4 border-t border-border">
            <div className="text-xs text-muted-foreground text-center">
              Jira Clone v1.0
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
});

export const Sidebar = () => {
  return (
    <MediaQuery minWidth={768}>
      <SidebarComponent />
    </MediaQuery>
  )
}