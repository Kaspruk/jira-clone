"use client";

import { memo, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { TaskType } from "@/features/types";
import { getQueryClient } from "@/lib/react-query";
import { QueriesKeys } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { MediaQuery } from "./MediaQueryWrapper";

import { getNavidationStateKey } from "./utils";
import { NavigationState } from "./constants";

const BackButtonComponent = memo(() => {
    const params = useParams();
    const router = useRouter();
    const queryClient = getQueryClient();
    const navigationState = getNavidationStateKey(params as Record<string, string>);

    const backUrl = useMemo(() => {
        switch (navigationState) {
            case NavigationState.Workspace:
                return `/`;
            case NavigationState.Project:
                return `/${params.workspaceId}/projects`;
            case NavigationState.Task:
                const task = queryClient.getQueryData<TaskType>([QueriesKeys.Task, Number(params.taskId)]);
                return task ? `/${task.workspace_id}/projects/${task.project_id}/tasks` : '';
        }
    }, [navigationState, params]);

    const handleBack = () => {
        if (!backUrl) {
            return;
        }

        router.push(backUrl);
    }

    return (
        <Button
            size="iconSm"
            variant="outline"
            onClick={handleBack}
        >
            <Icon name="arrow_back" size={18} />
        </Button>
    );
});

export const BackButton = () => {
    return (
        <MediaQuery maxWidth={768}>
            <BackButtonComponent />
        </MediaQuery>
    )
}