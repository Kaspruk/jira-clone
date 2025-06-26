"use client";

import { useMemo, memo } from "react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { AnimatePresence } from "motion/react";
import * as motion from "motion/react-client";

import { buildRoute, cn } from "@/lib/utils";
import { RouteType, RoutesMap, SidebarState } from "./constants";
import { getSidebarStateKey } from "./utils";
import { Routes } from "@/lib/constants";

export const MenuList = memo(() => {
  const params = useParams();
  const pathname = usePathname();
  const sidebarState = getSidebarStateKey(params as Record<string, string>);

  const menuItems = useMemo(() => {
    let items: RouteType[] = [];

    switch (sidebarState) {
        case SidebarState.Task:
          items = [RoutesMap[Routes.Home], RoutesMap[Routes.Project]];
          break;
        case SidebarState.Project:
          items = [RoutesMap[Routes.Home], RoutesMap[Routes.Project]];
          break;
        case SidebarState.Workspace:
          items = [RoutesMap[Routes.Home]];
          break;
    }

    return items.map(route => {
        const href = buildRoute(route.href, params as Record<string, string>);

        const isActive = pathname === href;
        const Icon = isActive ? route.activeIcon : route.icon;

        return (
            <MenuItem
              key={href}
              href={href}
              isActive={isActive}
            >
              <Icon className="size-5 text-neutral-500" />
              {route.label}
            </MenuItem>
        );
    })
  }, [pathname, sidebarState]);

  return (
    <div>
      <AnimatePresence mode="popLayout">
        <motion.ul
          key={sidebarState}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
        >
          {menuItems}
        </motion.ul>
      </AnimatePresence>
    </div>
  );
});

type MenuItemProps = {
    href: string;
    children: React.ReactNode;
    isActive?: boolean;
};
  
function MenuItem (props: MenuItemProps) {
    return (
        <Link key={props.href} href={props.href}>
          <div
            className={cn(
              "flex items-center gap-2.5 p-2.5 rounded-md font-medium hover:text-primary transition text-neutral-500",
              props.isActive && "bg-white shadow-sm hover:opacity-100 text-primary"
            )}
          >
            {props.children}
          </div>
        </Link>
    );
};