import React, { useState, useEffect } from 'react';
import { Controller, Control } from 'react-hook-form';
import { Icon } from './ui/icon';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ErrorMessage } from './ui/error-message';

interface IconFormProps {
  icon: string;
  color: string;
  control: Control<any>;
}

export function IconForm(props: IconFormProps) {
  const { icon, color, control } = props;

  const [iconName, setIconName] = useState(icon);
  const [iconColor, setIconColor] = useState(color);

  useEffect(() => {
    setIconName(icon);
    setIconColor(color);
  }, [icon, color]);

  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-col gap-2 w-3/4">
        <div className='grow-1'>
          <Label htmlFor="name">Icon Name</Label>
          <Controller
            name="icon"
            control={control}
            rules={{ required: 'Icon name is required' }}
            render={({ field, fieldState: { error } }) => (
              <>
                <Input
                  id="name"
                  {...field}
                  onChange={(e) => {
                    setIconName(e.target.value);
                    field.onChange(e);
                  }}
                />
                {error && <ErrorMessage>{error.message}</ErrorMessage>}
              </>
            )}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="color">Color</Label>
          <Controller
            name="color"
            control={control}
            rules={{ required: 'Color is required' }}
            render={({ field, fieldState: { error } }) => (
              <>
                <Input
                  id="color"
                  type="color"
                  {...field}
                  onChange={(e) => {
                    setIconColor(e.target.value);
                    field.onChange(e);
                  }}
                />
                {error && <ErrorMessage>{error.message}</ErrorMessage>}
              </>
            )}
          />
        </div>
      </div>
      <div className='w-1/2 flex justify-center items-center'>
          <Icon
            size={64}
            name={iconName}
            color={iconColor}
          />
      </div>
    </div>
  );
}
