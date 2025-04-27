"use client";

import { ListItem } from "@/components/ListItems"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { TaskStatusType } from "@/features/types"
import { useSortable } from "@dnd-kit/sortable"

export const TaskStatusListItem = (props: TaskStatusType & { onEdit: () => void }) => {
    const {
        id,
        name,
        icon,
        color,
        onEdit,
    } = props;

    const {
        attributes,
        isDragging,
        listeners,
        setNodeRef,
        setActivatorNodeRef,
        transform,
        transition,
    } = useSortable({ id });
    
    return (
        <ListItem
            {...attributes}
            ref={setNodeRef}
            title={name}
            left={(
                <div className="flex gap-2 items-center">
                    <Button
                        ref={setActivatorNodeRef}
                        variant="ghost"
                        size="icon"
                        {...listeners}
                    >
                        <Icon name="drag_handle" size={24} className="text-gray-500" />
                    </Button>
                    <Icon name={icon} size={24} color={color} />
                </div> 
            )}
            color={color}
            right={(
                <Button variant="ghost" size="icon" onClick={onEdit}>
                    <Icon name="edit" size={20} className="text-gray-500" />
                </Button>
            )}
            style={{
                transition,
                transform: transform ? `translate(${transform.x}px, ${transform.y}px) scale(${transform.scaleX}, ${transform.scaleY})` : undefined,
            }}
            isDragging={isDragging}
        />
    )
}
