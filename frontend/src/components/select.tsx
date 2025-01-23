"use client";

import { memo } from "react";
import { ControllerRenderProps } from "react-hook-form";
import {
  Select as SelectUI,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";

type SelectProps<T> = ControllerRenderProps & {
  id?: string;
  items?: T[];
  placeholder?: string;
} & ({
  children: React.ReactNode;
  getItemData?(data: T): { value: string, title: string };
} | {
  children?: React.ReactNode;
  getItemData(data: T): { value: string, title: string };
});

const genericMemo: <T>(component: T) => T = memo;

export const Select = genericMemo(<T,>(props: SelectProps<T>) => {
  const {
    id,
    ref,
    name,
    value,
    onBlur,
    disabled,
    onChange,
    items,
    placeholder = 'No item selected',
    children, 
    getItemData,
  } = props;

  const onOpenChange = (isOpened: boolean) => {
    if (!isOpened) {
      onBlur?.();
    }
  };

  return (
    <SelectUI
      name={name}
      value={value}
      disabled={disabled}
      onOpenChange={onOpenChange}
      onValueChange={onChange}
    >
      <SelectTrigger ref={ref} id={id}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {children || items?.map((item) => {
          const {title, value} = getItemData?.(item) ?? { title: 'undefined', value: 'undefined' };
          return (
            <SelectItem key={title} value={value}>
              <div className="flex justify-start items-center gap-3 font-medium">
                <span className="truncate">{title}</span>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </SelectUI>
  );
});
