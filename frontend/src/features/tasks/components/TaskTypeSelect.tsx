import { ComponentProps } from "react";
import { Select } from "@/components/select";
import { SelectItem } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { getProject } from "@/features/projects";
import { Icon } from "@/components/ui/icon";

type TaskTypeSelectProps = Omit<ComponentProps<typeof Select>, 'getItemData'> & {
    projectId: number;
}
export const TaskTypeSelect = (props: TaskTypeSelectProps) => {
    const { projectId, ...selectProps } = props;

    const { data: project } = useQuery(getProject(projectId));

    return (
        <Select {...selectProps}>
            {(project?.types ?? []).map(taskType => (
                <SelectItem key={taskType.id} value={String(taskType.id)}>
                    <div className="flex justify-start items-center gap-3 font-medium">
                        <Icon
                            size={16}
                            name={taskType.icon}
                            color={taskType.color}
                        />
                        <span className="truncate">
                            {taskType.name}
                        </span>
                    </div>
                </SelectItem>
            ))}
        </Select>
    )
};