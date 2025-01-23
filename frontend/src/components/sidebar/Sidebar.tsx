import { Navigation } from "./Navigation";

export const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-0 lg:block w-[240px] lg:w-aside h-full overflow-y-auto">
      <div className="h-full pt-10 p-4 w-full">
        <Navigation />
      </div>
    </aside>
  );
};
