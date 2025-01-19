"use client";

import Link from "next/link";
import { usePathname, useParams, useSelectedLayoutSegments } from "next/navigation";
import { GoHome, GoHomeFill, GoProject } from "react-icons/go";
import { AiFillProject } from "react-icons/ai";
import { LiaTasksSolid } from "react-icons/lia";
import { VscTasklist } from "react-icons/vsc";
import { IoSettingsOutline, IoSettingsSharp } from "react-icons/io5";
import { IconType } from "react-icons/lib";

import { cn } from "@/lib/utils";

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
    href: "projects/{projectId}/tasks",
    icon: VscTasklist,
    activeIcon: LiaTasksSolid,
  },
  {
    label: "Project settings",
    href: "projects/{projectId}/settings",
    icon: IoSettingsOutline,
    activeIcon: IoSettingsSharp,
  },
];

export const Navigation = () => {
  const params = useParams();
  const pathname = usePathname();
  const layouts = useSelectedLayoutSegments();

  // console.log('params', params);
  // console.log('pathname', pathname);
  // console.log('layouts', layouts);

  return (
    <div>
      <MenuList 
        items={rootRoutes}
        active={true}
        params={params}
        pathname={pathname}
      />
      <MenuList
        items={projectRoutes}
        active={true}
        params={params}
        pathname={pathname}
      />
    </div>

  );
};

type MenuListProps = {
  items: MenuItem[];
  active: boolean;
  params: ReturnType<typeof useParams>;
  pathname: string;
}

function MenuList(props: MenuListProps) {
  const {
    items,
    active,
    params,
    pathname,
  } = props;

  return (
    <ul className={}>
      {items.map((item) => {
        // const fullHref = `/workspaces/${workspaceId}${item.href}`
        const itemPath = getCurrentPath(item.href, params);
        console.log('itemPath', itemPath);
        const isActive = pathname === item.href;
        const Icon = isActive ? item.activeIcon : item.icon;

        return (
          <Link key={item.href} href={item.href}>
            <div className={cn(
              "flex items-center gap-2.5 p-2.5 rounded-md font-medium hover:text-primary transition text-neutral-500",
              isActive && "bg-white shadow-sm hover:opacity-100 text-primary"
            )}>
              <Icon className="size-5 text-neutral-500" />
              {item.label}
            </div>
          </Link>
        )
      })}
    </ul>
  )
};

function getCurrentPath(url: string, params: MenuListProps['params']): string {
  return Object.keys(params).reduce<string>((acc, paramKey) => {
    const param = params[paramKey];

    if (typeof param !== 'string') {
      return acc;
    }

    acc.replace(paramKey, param);
    return acc;
  }, url)
}
