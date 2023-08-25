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

      <label
        className={"relative block rounded-md border focus-within:ring-1 shadow-sm " + (errors && errors[fieldName] ? "border-red-600 focus-within:border-red-600 focus-within:ring-red-600 " : "border-gray-200 focus-within:border-blue-600 focus-within:ring-blue-600")}
      >

        <input
          type={type || "text"}
          className="peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 w-full dark:text-slate-200 autofill:!bg-navy-900"
          placeholder={text}
          ref={ref}
          {...rest}
        />

        <span
          className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs dark:bg-inherit dark:text-slate-100"
        >
          {text}
        </span>

      </label>

    </div>);
  });


export {
  Field, type IFormValues
}