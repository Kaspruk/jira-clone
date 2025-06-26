import { parseAsFloat, useQueryState } from "nuqs"

export const useWorkspaceModalState = () => {
    return useQueryState(
        "workspace-modal",
        parseAsFloat
    )
}