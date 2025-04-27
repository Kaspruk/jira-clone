import React from 'react';
import { Controller, Control } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ErrorMessage } from '@/components/ui/error-message';

interface IconFormProps {
  control: Control<any>;
}

export function IconForm(props: IconFormProps) {
  const { control } = props;
  return (
    <>
      <div>
        <Label htmlFor="name">Icon Name</Label>
        <Controller
          name="icon"
          control={control}
          rules={{ required: 'Icon name is required' }}
          render={({ field, fieldState: { error } }) => (
            <>
              <Input id="name" {...field} />
              {error && <ErrorMessage>{error.message}</ErrorMessage>}
            </>
          )}
        />
      </div>

      <div>
        <Label htmlFor="color">Color</Label>
        <Controller
          name="color"
          control={control}
          rules={{ required: 'Color is required' }}
          render={({ field, fieldState: { error } }) => (
            <>
              <Input id="color" type="color" {...field} />
              {error && <ErrorMessage>{error.message}</ErrorMessage>}
            </>
          )}
        />
      </div>
    </>
  );
}
