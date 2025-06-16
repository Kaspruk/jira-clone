import { ComponentProps } from "react";
import { Select } from "@/components/Select";
import { SelectItem } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { getProject } from "@/features/projects";
import { Icon } from "@/components/ui/icon";

type TaskStatusSelectProps = Omit<ComponentProps<typeof Select>, 'getItemData'> & {
    projectId: number;
}
export const TaskStatusSelect = (props: TaskStatusSelectProps) => {
    const { projectId, ...selectProps } = props;

    const { data: project } = useQuery(getProject(projectId));

    return (
        <Select {...selectProps}>
            {(project?.statuses ?? []).map(TaskStatus => (
                <SelectItem key={TaskStatus.id} value={String(TaskStatus.id)}>
                    <div className="flex justify-start items-center gap-3 font-medium">
                        <Icon
                            size={16}
                            name={TaskStatus.icon}
                            color={TaskStatus.color}
                        />
                        <span className="truncate">
                            {TaskStatus.name}
                        </span>
                    </div>
                </SelectItem>
            ))}
        </Select>
    )
};