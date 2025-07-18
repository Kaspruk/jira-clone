"use client";

import { LuLoader, LuArrowLeft } from "react-icons/lu";
import { View, ViewTitle } from "@/components/ui/view";
import { Skeleton } from "@/components/ui/skeleton";

const TaskLoadingPage = () => {
  return (
    <View>
      {/* Mobile back button placeholder */}
      <div className="flex items-center gap-2 mb-3 md:hidden">
        <div className="p-2 rounded-lg bg-muted/50">
          <LuArrowLeft className="size-4 text-muted-foreground" />
        </div>
        <ViewTitle>Back to tasks</ViewTitle>
      </div>

      <div className="flex sm:flex-row flex-col gap-4">
        {/* Main Content */}
        <div className="flex-1 space-y-4">
          {/* Title skeleton */}
          <Skeleton height="2rem" width="75%" />
          
          {/* Description section */}
          <div className="space-y-2">
            <Skeleton variant="text" width="5rem" />
            <div className="space-y-2">
              <Skeleton variant="text" width="100%" />
              <Skeleton variant="text" width="83%" />
              <Skeleton variant="text" width="67%" />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="sm:w-[240px] sm:space-y-3 sm:pl-4 sm:border-l border-border-sm max-sm:grid max-sm:grid-cols-2 max-sm:gap-2">
          {/* Project */}
          <div className="space-y-2">
            <Skeleton height="0.75rem" width="3rem" />
            <Skeleton variant="button" width="100%" />
          </div>
          
          {/* Status */}
          <div className="space-y-2">
            <Skeleton height="0.75rem" width="2.5rem" />
            <Skeleton variant="button" width="100%" />
          </div>
          
          {/* Type */}
          <div className="space-y-2">
            <Skeleton height="0.75rem" width="2rem" />
            <Skeleton variant="button" width="100%" />
          </div>
          
          {/* Priority */}
          <div className="space-y-2">
            <Skeleton height="0.75rem" width="3rem" />
            <Skeleton variant="button" width="100%" />
          </div>
          
          {/* Assigned */}
          <div className="space-y-2">
            <Skeleton height="0.75rem" width="3.5rem" />
            <Skeleton variant="button" width="100%" />
          </div>
          
          {/* Author */}
          <div className="space-y-2">
            <Skeleton height="0.75rem" width="2.5rem" />
            <Skeleton variant="text" width="4rem" />
          </div>
        </div>
      </div>

      {/* Loading indicator */}
      <div className="flex items-center justify-center mt-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <LuLoader className="size-4 animate-spin" />
          Завантажуємо задачу...
        </div>
      </div>
    </View>
  );
};

export default TaskLoadingPage; 