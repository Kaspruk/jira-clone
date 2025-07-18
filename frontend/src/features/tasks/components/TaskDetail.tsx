'use client';

import { useSuspenseQueries } from "@tanstack/react-query";
import { getUsers } from "@/features/users";
import { getProjects } from "@/features/projects";
import { ProjectType, UserType } from "@/features/types";
import { useUpdateTask, getTask } from "@/features/tasks/api";

import { Label } from "@/components/ui/label";
import { Select } from "@/components/select";
import { EditableInput, EditableEditor } from "@/components/editable";
import { TaskTypeSelect } from "./TaskTypeSelect";
import { TaskStatusSelect } from "./TaskStatusSelect";
import { TaskPrioritySelect } from "./TaskPrioritySelect";
import { cn } from "@/lib/utils";

type TaskDetailProps = React.PropsWithChildren<{
    taskId: number;
    workspaceId: number;
    onSave?(): void;
}>;

export const TaskDetail = (props: TaskDetailProps) => {
    const taskId = props.taskId;
    const workspaceId = props.workspaceId;

    const [taskData, projectsData, usersData] = useSuspenseQueries({
        queries: [getTask(taskId), getProjects(workspaceId!), getUsers]
    });

    const {data: task} = taskData;
    const {data: projects} = projectsData;
    const {data: users} = usersData;
    
    const { mutate: updateTask } = useUpdateTask(taskId);

    const author = users?.find(u => u.id === task?.author_id);

    const handleUpdate = (field: string) => (value: string) => {
        if (!task) return;
        
        try {
            const updatedTask = { 
                ...task, 
                [field]: value
            };
            
            updateTask(updatedTask, {
                onSuccess: () => {
                    props.onSave?.();
                }
            });
        } catch (error) {
            console.error('Failed to update task description:', error);
        }
    };

    if (!task || !workspaceId) return null;

    return (
        <div className="flex sm:flex-row flex-col gap-6">
            {/* Main Content */}
            <div className="flex-1">
                <EditableInput
                    value={task.title}
                    className="text-2xl font-bold"
                    onSave={handleUpdate('title')}
                />
                <Label className="block font-semibold mt-6 mb-3 text-foreground">Description</Label>
                <EditableEditor
                    value={task.description}
                    onSave={handleUpdate('description')}
                    placeholder="Add a description..."
                />
            </div>

            {/* Sidebar */}
            <div 
                className={cn(
                    "sm:w-[260px] sm:space-y-4 sm:pl-6 sm:border-l border-border",
                    "max-sm:grid max-sm:grid-cols-2 max-sm:gap-3"
                )}
            >
                <div>
                    <Label className="text-muted-foreground font-medium">Project</Label>
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
                    <Label className="text-muted-foreground font-medium">Status</Label>
                    <TaskStatusSelect 
                        value={String(task.status_id)}
                        projectId={task.project_id}
                        variant="preview"
                        onChange={handleUpdate('status_id')}
                    />
                </div>
                <div>
                    <Label className="text-muted-foreground font-medium">Type</Label>
                    <TaskTypeSelect
                        value={String(task.type_id)}
                        projectId={task.project_id}
                        variant="preview"
                        onChange={handleUpdate('type_id')}
                    />
                </div>
                <div>
                    <Label className="text-muted-foreground font-medium">Priority</Label>
                    <TaskPrioritySelect
                        value={String(task.priority_id)}
                        projectId={task.project_id}
                        variant="preview"
                        onChange={handleUpdate('priority_id')}
                    />
                </div>
                <div>
                    <Label className="text-muted-foreground font-medium">Assigned</Label>
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
                    <Label className="text-muted-foreground font-medium">Author</Label>
                    <div className="mt-1 text-sm text-foreground">{author?.username || '-'}</div>
                </div>
            </div>
        </div>
    );
}; 