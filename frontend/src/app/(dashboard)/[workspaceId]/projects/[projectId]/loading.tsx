import { LuLoader } from "react-icons/lu";
import { View } from "@/components/ui/view";
import { Skeleton } from "@/components/ui/skeleton";

const ProjectLoadingPage = () => {
  return (
    <View className="animate-slide-up">
      {/* Project header skeleton */}
      <div className="flex items-center gap-3 mb-6">
        <Skeleton height="3rem" width="3rem" className="rounded-lg" />
        <div className="flex-1">
          <Skeleton variant="title" width="12rem" className="mb-2" />
          <Skeleton variant="text" width="8rem" />
        </div>
      </div>

      {/* Navigation tabs skeleton */}
      <div className="flex space-x-1 mb-6">
        {['Overview', 'Tasks', 'Settings'].map((tab, index) => (
          <div
            key={tab}
            className="px-4 py-2 rounded-lg"
          >
            <Skeleton variant="text" width="4rem" />
          </div>
        ))}
      </div>

      {/* Content area skeleton */}
      <div className="space-y-6">
        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="bg-background border border-border-sm rounded-lg p-4"
            >
              <Skeleton variant="text" width="5rem" className="mb-2" />
              <Skeleton height="2rem" width="3rem" />
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="space-y-4">
          <Skeleton variant="title" width="8rem" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 border border-border-sm rounded-lg"
              >
                <Skeleton height="2rem" width="2rem" />
                <div className="flex-1">
                  <Skeleton variant="text" width="75%" className="mb-1" />
                  <Skeleton height="0.75rem" width="50%" />
                </div>
                <Skeleton height="1.5rem" width="4rem" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Loading indicator */}
      <div className="flex items-center justify-center mt-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <LuLoader className="size-4 animate-spin" />
          Завантажуємо проект...
        </div>
      </div>
    </View>
  );
};

export default ProjectLoadingPage; 