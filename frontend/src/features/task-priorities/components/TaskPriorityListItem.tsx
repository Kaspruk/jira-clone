"use client";

import { ListItem } from "@/components/ListItems"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Checkbox } from "@/components/ui/checkbox"
import { TaskPriorityType } from "@/features/types"
import { useSortable } from "@dnd-kit/sortable"

type TaskPriorityListItemProps = TaskPriorityType & {
    selected: boolean,
    onEdit: () => void,
    onSelect: (value: boolean) => void,
    onRemove: () => void,
}

export const TaskPriorityListItem = (props: TaskPriorityListItemProps) => {
    const {
        id,
        name,
        icon,
        color,
        selected,
        onEdit,
        onSelect,
        onRemove,
    } = props;

    const {
        attributes,
        isDragging,
        listeners,
        setNodeRef,
        setActivatorNodeRef,
        transform,
        transition,
    } = useSortable({ id, disabled: !selected });
    
    return (
        <ListItem
            {...attributes}
            ref={setNodeRef}
            title={name}
            disabled={!selected}
            aria-describedby=""
            left={(
                <div className="flex gap-2 items-center">
                    <Button
                        // @ts-ignore
                        ref={setActivatorNodeRef}
                        variant="ghost"
                        size="icon"
                        disabled={!selected}
                        {...listeners}
                    >
                        <Icon name="drag_handle" size={24} className="text-muted-foreground" />
                    </Button>
                    <Checkbox
                        checked={selected}
                        className="mr-2"
                        onCheckedChange={onSelect}
                    />
                    <Icon name={icon} size={24} color={color} />
                </div> 
            )}
            color={color}
            right={(
                <div className="flex gap-2 items-center">
                    <Button variant="ghost" size="icon" onClick={onEdit}>
                        <Icon name="edit" size={20} className="text-muted-foreground" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={onRemove}>
                        <Icon name="close" size={20} className="text-destructive" />
                    </Button>
                </div>
            )}
            style={{
                transition,
                transform: transform ? `translate(${transform.x}px, ${transform.y}px) scale(${transform.scaleX}, ${transform.scaleY})` : undefined,
            }}
            isDragging={isDragging}
        />
    )
} 