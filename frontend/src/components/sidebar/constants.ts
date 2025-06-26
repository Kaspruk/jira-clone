import { GoHome, GoHomeFill, GoProject } from "react-icons/go";
import { AiFillProject } from "react-icons/ai";
import { LiaTasksSolid } from "react-icons/lia";
import { VscTasklist } from "react-icons/vsc";
import { IoSettingsOutline, IoSettingsSharp } from "react-icons/io5";

import { Routes } from "@/lib/constants";

export type RouteType = {
    label: string;
    href: string;
    icon: React.ElementType;
    activeIcon: React.ElementType;
}

export const RoutesMap: Record<string, RouteType> = {
    [Routes.Home]: {
        label: "Home",
        href: Routes.Home,
        icon: GoHome,
        activeIcon: GoHomeFill,
    },
    [Routes.Projects]: {
        label: "Projects",
        href: Routes.Projects,
        icon: GoProject,
        activeIcon: AiFillProject,
    },
    [Routes.Project]: {
        label: "Project tasks",
        href: Routes.Projects,
        icon: GoProject,
        activeIcon: AiFillProject,
    },
    [Routes.ProjectSettings]: {
        label: "Project settings",
        href: Routes.ProjectSettings,
        icon: IoSettingsOutline,
        activeIcon: IoSettingsSharp,
    }
};

export enum SidebarState {
    Home = 'home',
    Workspace = 'workspace',
    Project = 'project',
    Task = 'task',
}

