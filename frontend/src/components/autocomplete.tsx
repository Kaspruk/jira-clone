"use client";

import { memo, useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";

type AutocompleteProps<T> = {
  items: T[];
  getItem(data: T): React.ReactElement;
} | {
  items: T[];
  getItemData(data: T): { value: string, title: string };
};

const genericMemo: <T>(component: T) => T = memo;

const Component = <T,>(props: AutocompleteProps<T>) => {
  const { items, getItem, getItemData } = props;

  const [value, setValue] = useState();

  const onSelect = (event: any) => {
    setValue(event);
    console.log("event", event);
  };

  return (
    <Select value={value} onValueChange={onSelect}>
      <SelectTrigger>
        <SelectValue placeholder="No project selected" />
      </SelectTrigger>
      <SelectContent>
        {/* <div className="p-1">
          <Input size="sm" value={value} type="input" placeholder="Search..." />
        </div>
        <DottedSeparator className="my-2" /> */}
        {items.map((item) => {
          if (getItem) {
            return getItem(item);
          }

          const {title, value} = getItemData(item);
          return (
            <SelectItem key={title} value={value}>
              <div className="flex justify-start items-center gap-3 font-medium">
                <span className="truncate">{title}</span>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};

Component.Item = SelectItem;

export const Autocomplete = genericMemo(Component);
