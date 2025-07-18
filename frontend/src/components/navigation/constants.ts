import { GoHome, GoHomeFill, GoProject } from "react-icons/go";
import { AiFillProject } from "react-icons/ai";
import { IoSettingsOutline, IoSettingsSharp } from "react-icons/io5";
import { SiTask } from "react-icons/si";

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
    },
    [Routes.Task]: {
        label: "Task",
        href: Routes.Task,
        icon: SiTask,
        activeIcon: SiTask,
    },
};

export enum NavigationState {
    Home = 'home',
    Workspace = 'workspace',
    Project = 'project',
    Task = 'task',
}

