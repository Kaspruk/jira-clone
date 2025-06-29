"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { EditableEditor, EditableInput } from "@/components/editable";
import { getProject } from "@/features/projects";
import { useUpdateProject } from "@/features/projects";
import { DottedSeparator } from "@/components/DottedSeparator";
import { Label } from "@/components/ui/label";

type ProjectFormProps = {
  projectId: number;
  onSave?: () => void;
}

export const ProjectForm = (props: ProjectFormProps) => {
  const { projectId } = props;
  const { data: project } = useSuspenseQuery(getProject(projectId));

  const { mutate: updateProject } = useUpdateProject(projectId);

  const handleUpdate = (field: string) => (value: string) => {    
    try {
        const updatedProject = { 
            ...project, 
            [field]: value
        };
        
        updateProject(updatedProject, {
            onSuccess: () => {
                props.onSave?.();
            }
        });
    } catch (error) {
        console.error('Failed to update task description:', error);
    }
};

  return (
    <>
      <div className="sm:-mt-2 -mt-1 relative z-10">
        <EditableInput
            value={project.name}
            className="font-semibold tracking-tight text-xl"
            onSave={handleUpdate('name')}
        />
      </div>
      <DottedSeparator className="mt-1 mb-3" />
      <Label className="block font-bold mt-4 mb-2">Description</Label>
      <EditableEditor
          value={project.description}
          className="mb-4"
          placeholder="Add a description..."
          onSave={handleUpdate('description')}
      />
    </>
  );
};

