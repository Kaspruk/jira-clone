"use client";

import { ControllerRenderProps } from "react-hook-form";
import { genericMemo } from "@/lib/utils";
import {
  Select as SelectUI,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";

type SelectProps<T> = Partial<ControllerRenderProps> & {
  id?: string;
  items?: T[];
  variant?: 'default' | 'preview';
  placeholder?: string;
} & ({
  children: React.ReactNode;
  getItemData?(data: T): { value: string, title: string };
} | {
  children?: React.ReactNode;
  getItemData(data: T): { value: string, title: string };
});

export const Select = genericMemo(<T,>(props: SelectProps<T>) => {
  const {
    id,
    ref,
    name,
    value,
    onBlur,
    variant,
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
      <SelectTrigger ref={ref} id={id} variant={variant}>
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
