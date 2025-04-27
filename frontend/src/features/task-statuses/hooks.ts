import { useQueryState, parseAsBoolean } from "nuqs";

export function useTaskStatusModalState() {
    return useQueryState(
        "tasks-statuses",
        parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true })
    )
}