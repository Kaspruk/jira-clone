'use client';

import { LuLoader, LuPlus } from 'react-icons/lu';
import { View } from '@/components/ui/view';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const WorkspaceLoadingPage = () => {
  return (
    <View className="animate-slide-up">
      <div className="flex items-center justify-between mb-5">
        <div>
          <Skeleton variant="title" width="12rem" className="mb-2" />
          <Skeleton variant="text" width="8rem" />
        </div>
        <Button variant="primary" size="sm" disabled className="opacity-50">
          <LuPlus className="size-4 mr-1" />
          Quick Action
        </Button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="bg-background border border-border-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Skeleton variant="text" width="5rem" />
              <Skeleton height="1rem" width="1rem" />
            </div>
            <Skeleton height="2rem" width="4rem" className="mb-1" />
            <Skeleton height="0.75rem" width="6rem" />
          </div>
        ))}
      </div>

      {/* Recent activity section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="space-y-4">
          <Skeleton variant="title" width="8rem" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 border border-border-sm rounded-lg"
              >
                <Skeleton variant="avatar" className="rounded-md" />
                <div className="flex-1">
                  <Skeleton variant="text" width="75%" className="mb-1" />
                  <Skeleton height="0.75rem" width="50%" />
                </div>
                <Skeleton height="1.5rem" width="4rem" />
              </div>
            ))}
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="space-y-4">
          <Skeleton variant="title" width="8rem" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 border border-border-sm rounded-lg"
              >
                <Skeleton height="1.5rem" width="1.5rem" />
                <div className="flex-1">
                  <Skeleton variant="text" width="75%" className="mb-1" />
                  <Skeleton height="0.75rem" width="50%" />
                </div>
                <div className="flex gap-2">
                  <Skeleton height="1.5rem" width="3rem" />
                  <Skeleton height="1.5rem" width="3rem" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Loading indicator */}
      <div className="flex items-center justify-center mt-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <LuLoader className="size-4 animate-spin" />
          Завантажуємо dashboard...
        </div>
      </div>
    </View>
  );
};

export default WorkspaceLoadingPage;
