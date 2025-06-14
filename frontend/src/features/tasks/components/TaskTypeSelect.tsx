import { ComponentProps } from "react";
import { Select } from "@/components/Select";
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
            {(project?.statuses ?? []).map(taskStatus => (
                <SelectItem key={taskStatus.id} value={String(taskStatus.id)}>
                    <div className="flex justify-start items-center gap-3 font-medium">
                        <Icon
                            size={16}
                            name={taskStatus.icon}
                            color={taskStatus.color}
                        />
                        <span className="truncate">
                            {taskStatus.name}
                        </span>
                    </div>
                </SelectItem>
            ))}
        </Select>
    )
};