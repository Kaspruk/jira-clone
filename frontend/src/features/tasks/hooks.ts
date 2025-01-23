import { useQueryState, parseAsBoolean } from "nuqs";

export const useTaskModalState = () => {
    return useQueryState(
        "create-task",
        parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true })
    )
};