import { GoHome, GoHomeFill, GoProject } from "react-icons/go";
import { AiFillProject } from "react-icons/ai";
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
    [Routes.Workspace]: {
        label: "Workspace",
        href: Routes.Workspace,
        icon: GoProject,
        activeIcon: AiFillProject,
    },
    [Routes.Project]: {
        label: "Tasks",
        href: Routes.Project,
        icon: GoProject,
        activeIcon: AiFillProject,
    },
    [Routes.ProjectSettings]: {
        label: "Settings",
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

