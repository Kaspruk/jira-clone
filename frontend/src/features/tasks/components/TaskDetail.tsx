'use client';

import { useQueries } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { getUsers } from "@/features/users";
import { getProjects } from "@/features/projects";
import { ProjectType, TaskType, UserType, TaskPriority } from "@/features/types";
import { toCapitalize } from "@/lib/utils";
import { useUpdateTask } from "@/features/tasks/api";

import { Label } from "@/components/ui/label";
import { Select } from "@/components/Select";
import { EditableInput, EditableEditor } from "@/components/editable";
import { TaskTypeSelect } from "./TaskTypeSelect";

const TaskPriorityList = Object.values(TaskPriority);

type TaskDetailProps = React.PropsWithChildren<{
    data: TaskType;
    onSave?(): void;
}>;

export const TaskDetail = (props: TaskDetailProps) => {
    const task = props.data;

    const params = useParams();
    const router = useRouter();
    const queryClient = useQueryClient();
    const taskId = params.taskId as string;
    
    const { mutate: updateTask } = useUpdateTask(taskId);

    const [projectsData, usersData] = useQueries({
        queries: [getProjects, getUsers]
    });
    const {data: projects} = projectsData;
    const {data: users} = usersData;

    const author = users?.find(u => u.id === props.data?.author_id);

    const handleUpdate = (field: string) => (value: string) => {
        if (!props.data) return;
        
        try {
            const updatedTask = { 
                ...props.data, 
                [field]: value
            };
            
            updateTask(updatedTask, {
                onSuccess: () => {
                    props.onSave?.();
                    router.refresh();
                }
            });
        } catch (error) {
            console.error('Failed to update task description:', error);
        }
    };

    return (
        <div className="flex gap-4">
            {/* Main Content */}
            <div className="flex-1">
                <EditableInput
                    value={task.title}
                    className="text-2xl font-bold"
                    onSave={handleUpdate('title')}
                />
                <Label className="block font-bold mt-4 mb-2">Description</Label>
                <EditableEditor
                    value={task.description}
                    onSave={handleUpdate('description')}
                    placeholder="Add a description..."
                />
            </div>

            {/* Sidebar */}
            <div className="w-[240px] space-y-3 pl-4 border-l border-gray-200">
                <div>
                    <Label className="text-gray-500">Project</Label>
                    <Select<ProjectType>
                        value={String(task.project_id)}
                        items={projects || []}
                        getItemData={item => ({
                            value: String(item.id),
                            title: item.name,
                        })}
                        variant="preview"
                        onChange={handleUpdate('project_id')}
                    />
                </div>
                <div>
                    <Label className="text-gray-500">Type</Label>
                    <TaskTypeSelect
                        value={task.type}
                        variant="preview"
                        onChange={handleUpdate('type')}
                    />
                </div>
                <div>
                    <Label className="text-gray-500">Priority</Label>
                    <Select<string>
                        items={TaskPriorityList || []}
                        value={task.priority}
                        variant="preview"
                        getItemData={item => ({
                            value: item,
                            title: toCapitalize(item),
                        })}
                        onChange={handleUpdate('priority')}
                    />
                </div>
                <div>
                    <Label className="text-gray-500">Assigned</Label>
                    <Select<UserType>
                        items={users || []}
                        value={String(task.assignee_id)}
                        variant="preview"
                        getItemData={item => ({
                            value: String(item.id),
                            title: item.username,
                        })}
                        onChange={handleUpdate('assignee_id')}
                    />
                </div>
                <div>
                    <Label className="text-gray-500">Author</Label>
                    <div className="mt-1 text-sm">{author?.username || '-'}</div>
                </div>
                <div>
                    <Label className="text-gray-500">Status</Label>
                    <div className="mt-1 text-sm">{props.data?.status ? toCapitalize(props.data.status) : '-'}</div>
                </div>
            </div>
        </div>
    );
}; 