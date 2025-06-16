import { useQueryState, parseAsBoolean } from "nuqs";

export function useTaskTypeModalState() {
    return useQueryState(
        "task-types",
        parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true })
    );
} 