import React, { useState } from "react";
import {
    closestCenter,
    DndContext,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    UniqueIdentifier,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import {
    restrictToParentElement,
    restrictToVerticalAxis,
  } from '@dnd-kit/modifiers';
import { genericMemo } from "@/lib/utils";

const modifiers = [restrictToVerticalAxis, restrictToParentElement];

type SortableListProps<T> = {
    items: T[];
    getIndex: (id: UniqueIdentifier) => number;
    renderItem: (item: T) => React.ReactElement;
    onReorder: (oldIndex: number, newIndex: number) => void;
};

export const SortableList = genericMemo(<T extends { id: UniqueIdentifier },>(props: SortableListProps<T>) => {
    const {
        items,
        getIndex,
        renderItem,
        onReorder,
    } = props;

    const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
    const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(TouchSensor),
        useSensor(KeyboardSensor)
    );

    const activeIndex = activeId != null ? getIndex(activeId) : -1;

    return (
        <DndContext
            sensors={sensors}
            modifiers={modifiers}
            collisionDetection={closestCenter}
            onDragStart={({active}) => {
                if (!active) {
                  return;
                }
        
                setActiveId(active.id);
            }}
            onDragEnd={({over}) => {
                setActiveId(null);
        
                if (over) {
                    const overIndex = getIndex(over.id);
                    if (activeIndex !== overIndex) {
                        onReorder(activeIndex, overIndex);
                    }
                }
            }}
            onDragCancel={() => setActiveId(null)}
        >
            <ul className="flex flex-col gap-2 bg-gray-50 rounded-lg p-2">
                <SortableContext items={items} strategy={verticalListSortingStrategy}>
                    {items.map(renderItem)}
                </SortableContext>
            </ul>
        </DndContext>
    )
});
