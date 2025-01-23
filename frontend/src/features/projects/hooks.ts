import { useQueryState, parseAsBoolean } from "nuqs";

export const useProjectModalState = () => {
    return useQueryState(
        "create-project",
        parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true })
    )
};