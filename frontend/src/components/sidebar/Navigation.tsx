"use client";

import Link from "next/link";
import {
  usePathname,
  useParams,
  useSelectedLayoutSegments,
} from "next/navigation";
import { AnimatePresence } from "motion/react";
import * as motion from "motion/react-client";

import { GoHome, GoHomeFill, GoProject } from "react-icons/go";
import { AiFillProject } from "react-icons/ai";
import { LiaTasksSolid } from "react-icons/lia";
import { VscTasklist } from "react-icons/vsc";
import { IoSettingsOutline, IoSettingsSharp } from "react-icons/io5";
import { IconType } from "react-icons/lib";
import { BsArrowLeftSquare } from "react-icons/bs";



import { cn } from "@/lib/utils";
import { DottedSeparator } from "../DottedSeparator";

type MenuItem = {
  href: string;
  label: string;
  icon: IconType;
  activeIcon: IconType;
};

const rootRoutes: MenuItem[] = [
  {
    label: "Home",
    href: "/",
    icon: GoHome,
    activeIcon: GoHomeFill,
  },
  {
    label: "Projects",
    href: "/projects",
    icon: GoProject,
    activeIcon: AiFillProject,
  },
];

const projectRoutes: MenuItem[] = [
  {
    label: "Tasks",
    href: "/projects/{projectId}/tasks",
    icon: VscTasklist,
    activeIcon: LiaTasksSolid,
  },
  {
    label: "Project settings",
    href: "/projects/{projectId}/settings",
    icon: IoSettingsOutline,
    activeIcon: IoSettingsSharp,
  },
];

type MenuItemProps = {
  href: string;
  children: React.ReactNode;
  isActive?: boolean;
};

const MenuItem = (props: MenuItemProps) => (
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

export const Navigation = () => {
  const params = useParams();
  const pathname = usePathname();
  const layouts = useSelectedLayoutSegments();
  const isProjectMenuActive = layouts[0] === "projects" && layouts.length > 1;

  const renderItems = (items: MenuItem[]) => {
    return items.map((item) => {
      const itemPath = getCurrentPath(item.href, params);
      const isActive = pathname === itemPath;
      const Icon = isActive ? item.activeIcon : item.icon;

      return (
        <MenuItem
          key={itemPath}
          href={itemPath}
          isActive={isActive}
        >
          <Icon className="size-5 text-neutral-500" />
          {item.label}
        </MenuItem>
      );
    });
  };

  return (
    <div>
      <AnimatePresence mode="popLayout">
        {isProjectMenuActive ? (
          <motion.div
            key="project"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
          >
            <MenuItem
              href="/projects"
            >
              <BsArrowLeftSquare className="size-5 text-neutral-500" />
              Back to projects
            </MenuItem>
            <DottedSeparator className="mt-2 mb-4" />
            <ul>
              {renderItems(projectRoutes)}
            </ul>
          </motion.div>
        ) : (
          <motion.ul
            key="root"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
          >
            {renderItems(rootRoutes)}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

type MenuListProps = {
  items: MenuItem[];
  active: boolean;
  params: ReturnType<typeof useParams>;
  pathname: string;
};

function getCurrentPath(url: string, params: MenuListProps["params"]): string {
  return Object.keys(params).reduce<string>((acc, paramKey) => {
    const param = params[paramKey];

    if (typeof param !== "string") {
      return acc;
    }

    return acc.replace(`{${paramKey}}`, param);
  }, url);
}
