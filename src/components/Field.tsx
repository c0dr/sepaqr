import { LucideIcon } from 'lucide-react';
import * as React from 'react';
import { IconType } from 'react-icons';
import { ImSpinner2 } from 'react-icons/im';

import { cn } from '@/lib/utils';
import { FieldErrors, Path, UseFormRegister } from 'react-hook-form';

interface IFormValues {
  iban: string,
  amount: string,
  recipient: string,
  usage: string,
}

type InputProps = React.ComponentPropsWithoutRef<'input'> & {
  fieldName: Path<IFormValues>;
  register?: UseFormRegister<IFormValues>;
  errors: FieldErrors
  validate?: (string: string) => boolean
  text: string
};


const Field = React.forwardRef<HTMLInputElement, InputProps>(
  ({ fieldName, register, required, errors, type, text, ...rest }: InputProps, ref) => {

    return (<div className='mt-4'>



      <div>
        <input
          type={type || "text"}
          name={fieldName}
          placeholder={text}
          ref={ref}
          {...rest}
          id="first_name" className={
            "bg-gray-50 border  text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:placeholder-gray-400 dark:text-slate-700 "
            + (errors && errors[fieldName] ? " border-red-600 focus-within:border-red-600 focus-within:ring-red-600 focus:ring-red-600 focus:border-red-600 bg-red-100" : "border-gray-300 dark:bg-slate-200 dark:border-gray-600  focus-within:border-blue-600 focus-within:ring-blue-600")} />
      </div>

    </div>);
  });


export {
  Field, type IFormValues
}