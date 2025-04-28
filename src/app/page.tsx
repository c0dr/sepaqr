'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { IconContext } from 'react-icons';
import {
  MdAccountBalance,
  MdLockPerson,
  MdOutlineFlashOn,
  MdQrCode2,
  MdRestartAlt,
} from 'react-icons/md';

import { isValidIBAN } from '@/lib/iban';

import { Field, IFormValues } from '@/components/Field';
import UnderlineLink from '@/components/links/UnderlineLink';
import { SepaQR, SepaQrProps } from '@/components/SEPAQR';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

export default function HomePage() {
  const [formData, setFormData] = useState<SepaQrProps>();
  const [error, setError] = useState(true);

  const form = useForm<IFormValues>({
    mode: 'onChange',
    defaultValues: {
      iban: '',
      recipient: '',
      amount: '',
      usage: '',
    },
  });

  const {
    register,
    formState,
    formState: { errors },
    reset,
  } = form;

  useEffect(() => {
    setError(!formState.isValid);
  }, [formState]);

  const updateFormData = (data: IFormValues) => {
    setFormData({
      iban: data.iban,
      amount: data.amount ? parseFloat(data.amount) : undefined,
      recipient: data.recipient,
      usage: data.usage,
    });
  };

  const handleReset = () => {
    reset();
    setFormData(undefined);
    setError(true);
  };

  return (
    <main className='bg-background min-h-screen'>
      <div className='absolute right-4 top-4'>
        <ThemeToggle />
      </div>

      <div className='container flex min-h-screen flex-col items-center justify-center space-y-8 py-12'>
        <div className='flex flex-col items-center space-y-4'>
          <IconContext.Provider
            value={{ className: 'text-primary dark:text-primary', size: '4em' }}
          >
            <div className='flex gap-2'>
              <MdAccountBalance />
              <MdOutlineFlashOn />
            </div>
          </IconContext.Provider>

          <h1 className='text-foreground text-center text-3xl font-bold tracking-tight sm:text-4xl'>
            QR-Code für Überweisungen erstellen
          </h1>

          <div className='text-muted-foreground flex items-center text-sm'>
            <MdLockPerson className='mr-2' />
            Die Daten bleiben 100% privat und werden nicht an den Server
            gesendet
          </div>
        </div>

        <div className='mx-auto w-full max-w-md'>
          <div className='bg-card text-card-foreground rounded-lg border p-6 shadow-lg'>
            <Form {...form}>
              <form
                onChange={form.handleSubmit(updateFormData)}
                className='space-y-4'
              >
                <Field
                  fieldName='iban'
                  text='IBAN'
                  {...register('iban', { validate: isValidIBAN })}
                  errors={errors}
                  autoComplete='iban'
                  required
                />

                <Field
                  fieldName='amount'
                  text='Betrag'
                  type='number'
                  min='0.01'
                  step='0.01'
                  {...register('amount')}
                  errors={errors}
                  autoComplete='transaction-amount'
                  required
                />

                <Field
                  fieldName='recipient'
                  text='Empfänger'
                  {...register('recipient', { required: true })}
                  errors={errors}
                  autoComplete='name'
                  required
                />

                <Field
                  fieldName='usage'
                  text='Verwendungszweck'
                  errors={errors}
                  {...register('usage')}
                />

                <div className='mt-4 flex justify-end'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={handleReset}
                    className='flex items-center gap-2'
                  >
                    <MdRestartAlt className='text-lg' />
                    Zurücksetzen
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>

        <div className='flex min-h-[256px] items-center justify-center rounded-lg p-6'>
          {!error && (
            <SepaQR
              iban={formData?.iban}
              recipient={formData?.recipient}
              amount={formData?.amount}
              usage={formData?.usage}
            />
          )}
          {error && (
            <div className='text-muted-foreground flex flex-col items-center gap-2'>
              <MdQrCode2 size={48} />
              <p>Füllen Sie das Formular aus, um einen QR-Code zu generieren</p>
            </div>
          )}
        </div>

        <footer className='text-muted-foreground text-sm'>
          © {new Date().getFullYear()} von{' '}
          <UnderlineLink href='https://mrsimon.dev'>Simon</UnderlineLink>
        </footer>
      </div>
    </main>
  );
}
