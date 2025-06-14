import { useQueryState, parseAsBoolean } from "nuqs";

export function useTaskPriorityModalState() {
    return useQueryState(
        "tasks-priorities",
        parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true })
    )
} 