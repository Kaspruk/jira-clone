import { ComponentProps } from "react";
import { Select } from "@/components/select";
import { TypeTask } from "@/features/types";
import { TaskTypeData } from "@/lib/constants";
import { SelectItem } from "@/components/ui/select";

const taskTypes = Object.values(TypeTask)

export const TaskTypeSelect = (props: Omit<ComponentProps<typeof Select>, 'getItemData'>) => {
    return (
        <Select {...props}>
            {taskTypes.map(type => {
                const data = TaskTypeData[type];
                const Icon = data.icon;

                return (
                    <SelectItem key={type} value={type}>
                        <div className="flex justify-start items-center gap-3 font-medium">
                            <Icon className="size-4 stroke-2" fill={data.color} />
                            <span className="truncate">
                                {data.title}
                            </span>
                        </div>
                    </SelectItem>
                )
            })}
        </Select>
    )
};