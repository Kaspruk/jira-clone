import { LuLoader, LuPlus } from "react-icons/lu";
import { View, ViewTitle } from "@/components/ui/view";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const TasksLoadingPage = () => {
  return (
    <View className="animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <ViewTitle>Tasks</ViewTitle>
          <Button variant="primary" size="sm" disabled className="opacity-50">
            <LuPlus className="size-4 mr-1" />
            Add Task
          </Button>
        </div>

        {/* DataTable skeleton */}
        <div className="rounded-md border border-border-sm bg-background">
        {/* Table header */}
        <div className="border-b border-border-sm bg-muted/30">
          <div className="flex items-center px-4 py-3 space-x-4">
            <Skeleton variant="text" width="5rem" />
            <Skeleton variant="text" width="6rem" />
            <Skeleton variant="text" width="4rem" />
            <Skeleton variant="text" width="5rem" />
            <Skeleton variant="text" width="5rem" />
            <div className="ml-auto">
              <Skeleton variant="text" width="3rem" />
            </div>
          </div>
        </div>

        {/* Table rows */}
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="border-b border-border/50 px-4 py-3"
          >
            <div className="flex items-center space-x-4">
              <Skeleton variant="text" width="8rem" />
              <Skeleton variant="text" width="7rem" />
              <Skeleton variant="text" width="4rem" />
              <Skeleton variant="text" width="5rem" />
              <Skeleton variant="text" width="6rem" />
              <div className="ml-auto">
                <Skeleton height="1.5rem" width="1.5rem" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Loading indicator */}
      <div className="flex items-center justify-center mt-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <LuLoader className="size-4 animate-spin" />
          Завантажуємо задачі...
        </div>
      </div>
    </View>
  );
};

export default TasksLoadingPage; 