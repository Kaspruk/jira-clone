import { ComponentProps } from "react";
import { Select } from "@/components/select";
import { SelectItem } from "@/components/ui/select";
import { getProject } from "@/features/projects";
import { useQuery } from "@tanstack/react-query";
import { Icon } from "@/components/ui/icon";

type TaskPropertySelectProps = Omit<ComponentProps<typeof Select>, 'getItemData'> & {
    projectId: number;
}
export const TaskPrioritySelect = (props: TaskPropertySelectProps) => {
    const { projectId, ...selectProps } = props;

    const { data: project } = useQuery(getProject(projectId));
    
    return (
        <Select {...selectProps}>
            {(project?.priorities ?? []).map(taskPriority => {
                return (
                    <SelectItem key={taskPriority.id} value={String(taskPriority.id)}>
                        <div className="flex justify-start items-center gap-3 font-medium">
                            <Icon
                                size={16}
                                name={taskPriority.icon}
                                color={taskPriority.color}
                            />
                            <span className="truncate">
                                {taskPriority.name}
                            </span>
                        </div>
                    </SelectItem>
                )
            })}
        </Select>
    )
};