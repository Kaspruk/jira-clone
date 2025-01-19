import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Projects } from "./Projects";
import { Navigation } from "./Navigation";
import { DottedSeparator } from "../DottedSeparator";
import { WorkspaceSwitcher } from "./WorkspaceSwitcher";

export const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-0 lg:block w-[240px] lg:w-aside h-full overflow-y-auto">
      <div className="h-full pt-10 p-4 w-full">
        {/* <Link href="/">
          <Image src="/logo.svg" alt="logo" width={164} height={48} />
        </Link> */}
        {/* <DottedSeparator className="my-4" /> */}
        {/* <WorkspaceSwitcher /> */}
        {/* <DottedSeparator className="my-4" /> */}
        <Navigation />
        {/* <DottedSeparator className="my-4" /> */}
        {/* <Projects /> */}
      </div>
    </aside>
  );
};
