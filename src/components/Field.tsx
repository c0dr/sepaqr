'use client';

import * as React from 'react';
import { FieldErrors, Path } from 'react-hook-form';

import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export interface IFormValues {
  iban: string;
  amount: string;
  recipient: string;
  usage: string;
}

type InputProps = React.ComponentPropsWithoutRef<'input'> & {
  fieldName: Path<IFormValues>;
  errors: FieldErrors;
  validate?: (string: string) => boolean;
  text: string;
};

const Field = React.forwardRef<HTMLInputElement, InputProps>(
  ({ fieldName, required, errors, type, text, ...rest }: InputProps, ref) => {
    return (
      <FormItem>
        <FormLabel>{text}</FormLabel>
        <FormControl>
          <Input
            type={type || 'text'}
            placeholder={text}
            required={required}
            {...rest}
            ref={ref}
            className='w-full'
          />
        </FormControl>
        {errors[fieldName] && (
          <FormMessage>
            {typeof errors[fieldName]?.message === 'string'
              ? errors[fieldName]?.message
              : 'Invalid input'}
          </FormMessage>
        )}
      </FormItem>
    );
  }
);

Field.displayName = 'Field';

export { Field };
