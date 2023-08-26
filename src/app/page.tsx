'use client';

import Head from 'next/head';
import * as React from 'react';

import UnderlineLink from '@/components/links/UnderlineLink';

import { MdAccountBalance } from "react-icons/md";
import { MdOutlineFlashOn } from "react-icons/md";
import { MdLockPerson } from "react-icons/md";
import { IconContext } from "react-icons";

import { Field, IFormValues } from '@/components/Field';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useState } from 'react';
import { useEffect } from 'react';
import { isValidIBAN } from '@/lib/iban';
import { SepaQR, SepaQrProps } from '@/components/SEPAQR';

export default function HomePage() {
  const [formData, setFormData] = useState<SepaQrProps>();
  const [error, setError] = useState(false);

  const { register, handleSubmit, watch, formState, formState: { errors } } = useForm<IFormValues>({
    mode: 'onChange',
    shouldFocusError: false,
    shouldUseNativeValidation: true,
  });

  useEffect(() => {
    setError(!formState.isValid)
  }, [formState])

  const onSubmit: SubmitHandler<IFormValues> = data => {
    setFormData({
      iban: data.iban,
      amount: data.amount ? parseFloat(data.amount) : undefined,
      recipient: data.recipient,
      usage: data.usage
    })
  }

  return (
    <main>
      <Head>
        <title>Hi</title>
      </Head>
      <section className='bg-white dark:bg-blue-900'>
        <div className='layout relative flex min-h-screen flex-col items-center justify-center py-12 text-center'>


          <IconContext.Provider value={{ className: "text-orange-400 dark:text-orange-600", size: "5em" }}>
            <MdAccountBalance />
            <MdOutlineFlashOn />
          </IconContext.Provider>

          <h1 className='mt-4 dark:text-white'>QR-Code für Überweisungen erstellen</h1>
          <IconContext.Provider value={{ className: "display-inline" }}>
            <div className='mt-4 text-slate-400 dark:ext-slate-200'>
              <MdLockPerson className='inline' />Die Daten bleiben 100% privat und werden nicht an den Server gesendet
            </div>
          </IconContext.Provider>

          <form onChange={handleSubmit(onSubmit)} className='w-3/4 md:w-1/3'>

            <Field fieldName="iban" text='IBAN' {...register("iban", { validate: isValidIBAN })} errors={errors} required />

            <Field fieldName="amount" text='Betrag' type="number" min="0.01" step="0.01" {...register("amount")} errors={errors} autoComplete='transaction-amount' required />

            <Field fieldName="recipient" text='Empfänger' {...register("recipient", { required: true })} errors={errors} autoComplete='name' required />

            <Field fieldName="usage" text='Verwendungszweck' errors={errors} {...register("usage")} />

          </form>


          <div className='mt-10'>
            {!error && <SepaQR iban={formData?.iban} recipient={formData?.recipient} amount={formData?.amount} usage={formData?.usage} error={setError} />}
            {error && <div className='h-64' />}

          </div>

          <footer className='absolute bottom-2 text-gray-700 dark:text-slate-300'>
            © {new Date().getFullYear()} von{' '}
            <UnderlineLink href='https://mrsimon.dev'>
              Simon
            </UnderlineLink>
          </footer>
        </div>
      </section>
    </main>
  );
}