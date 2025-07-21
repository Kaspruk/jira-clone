'use client';

import { memo, useEffect } from "react";
import { useQueries } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import dynamic from "next/dynamic";

import { Select } from "@/components/select";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ErrorMessage } from "@/components/ui/error-message";
import { DottedSeparator } from "@/components/DottedSeparator";

import { useUser, getUsers } from "@/features/users";
import { getProject, getProjects } from "@/features/projects";
import { useCreateTask } from "@/features/tasks";
import { ProjectType, TaskType, UserType } from "@/features/types";

import { TaskTypeSelect } from "./TaskTypeSelect";
import { TaskPrioritySelect } from "./TaskPrioritySelect";
const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

type FormDataType = Omit<TaskType, 
    'id' | 
    'project_id' | 
    'created_at' | 
    'updated_at'
> & {
    project_id: string;
};

type TaskFormType = React.PropsWithChildren<{
    className?: string;
    data?: TaskType;
    onSave?(): void;
}>;

export const TaskForm = memo((props: TaskFormType) => {
    const params = useParams();
    const projectId = props.data?.project_id ?? Number(params.projectId);
    const workspaceId = Number(params.workspaceId);

    const { data: user } = useUser();

    const [projectData, projectsData, usersData] = useQueries({
        queries: [getProject(projectId), getProjects(workspaceId), getUsers]
    });
    const {data: project} = projectData;
    const {data: projects} = projectsData;
    const {data: users} = usersData;

    const { mutate } = useCreateTask(projectId);

    const {
        control,
        setValue,
        handleSubmit,
        formState: { errors, isValid, isSubmitted },
    } = useForm<FormDataType>({
        defaultValues: {
            title: '',
            type_id: undefined,
            status_id: undefined,
            priority_id: undefined,
            workspace_id: workspaceId,
            description: '',
            author_id: user.id,
            assignee_id: undefined,
            ...props.data,
            project_id: String(projectId),
        }
    });

    useEffect(() => {
        const firstStatusId = project?.statuses[0]?.id;

        if (firstStatusId) {
            setValue('status_id', firstStatusId);
        }
    }, [project]);

    const onSubmit = (data: FormDataType) => {
        mutate({
            ...data,
            project_id: Number(data.project_id)
        }, {
            onSuccess: () => {
                props.onSave?.();
            }
        });
    };

    return (
        <form className={props.className} onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 row-auto h-fit flex-1">
                <div>
                    <Label htmlFor="project_id">Project name</Label>
                    <Controller
                        name="project_id"
                        rules={{ required: { value: true, message: 'Field is required' }}}
                        control={control}
                        render={({ field }) => (
                            <Select<ProjectType>
                                {...field}
                                id="project_id"
                                value={String(field.value ?? 0)}
                                items={projects || []}
                                getItemData={item => ({
                                    value: String(item.id),
                                    title: item.name,
                                })}
                            />
                        )}
                    />
                    {errors.project_id && (<ErrorMessage>{errors.project_id.message}</ErrorMessage>)}
                </div>
                <div>
                    <Label htmlFor="type">Type</Label>
                    <Controller
                        name="type_id"
                        rules={{ required: { value: true, message: 'Field is required' }}}
                        control={control}
                        render={({ field }) => (
                            <TaskTypeSelect
                                {...field}
                                id="type_id"
                                projectId={projectId}
                            />
                        )}
                    />
                    {errors.type_id && (<ErrorMessage>{errors.type_id.message}</ErrorMessage>)}
                </div>
                <div>
                    <Label htmlFor="title">Title</Label>
                    <Controller
                        name="title"
                        rules={{ required: { value: true, message: 'Field is required' }}}
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                id="title"
                                placeholder="Text task title"
                            />
                        )}
                    />
                    {errors.title && (<ErrorMessage>{errors.title.message}</ErrorMessage>)}
                </div>
                <div>
                    <Label htmlFor="author_id">Author</Label>
                    <Controller
                        name="author_id"
                        rules={{ required: { value: true, message: 'Field is required' }}}
                        control={control}
                        render={({ field }) => (
                            <Select<UserType>
                                {...field}
                                id="author_id"
                                items={users || []}
                                value={String(field.value ?? 0)}
                                placeholder="Task author"
                                getItemData={item => ({
                                    value: String(item.id),
                                    title: item.username,
                                })}
                            />
                        )}
                    />
                    {errors.author_id && (<ErrorMessage>{errors.author_id.message}</ErrorMessage>)}
                </div>
                <div className="sm:col-span-2 h-fit min-h-[120px]">
                    <Label htmlFor="description">Description</Label>
                    <Controller
                        name="description"
                        rules={{ required: { value: true, message: 'Field is required' }}}
                        control={control}
                        render={({ field }) => (
                            <Editor
                                id="description"
                                placeholder="Tesk description..."
                                {...field}
                            />
                        )}
                    />
                    {errors.description && (<ErrorMessage>{errors.description.message}</ErrorMessage>)}
                </div>
                <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Controller
                        name="priority_id"
                        control={control}
                        rules={{ required: { value: true, message: 'Field is required' }}}
                        render={({ field }) => (
                            <TaskPrioritySelect
                                {...field}
                                id="priority_id"
                                projectId={projectId}
                            />
                        )}
                    />
                    {errors.priority_id && (<ErrorMessage>{errors.priority_id.message}</ErrorMessage>)}
                </div>
                <div>
                    <Label htmlFor="assignee_id">Assigned</Label>
                    <Controller
                        name="assignee_id"
                        rules={{ required: { value: true, message: 'Field is required' }}}
                        control={control}
                        render={({ field }) => (
                            <Select<UserType>
                                {...field}
                                id="assignee_id"
                                items={users || []}
                                value={String(field.value ?? 0)}
                                placeholder="Assign to user"
                                getItemData={item => ({
                                    value: String(item.id),
                                    title: item.username,
                                })}
                            />
                        )}
                    />
                    {errors.assignee_id && (<ErrorMessage>{errors.assignee_id.message}</ErrorMessage>)}
                </div>
            </div>
            <DottedSeparator className="my-4" />
            <div className="flex justify-between">
                {props.children}
                <div className="flex-1" />
                <Button
                    type="submit"
                    disabled={!isValid && isSubmitted}
                >
                    Save
                </Button>
            </div>
        </form>
    )
});