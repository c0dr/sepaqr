'use client';

import Head from 'next/head';
import * as React from 'react';

import ArrowLink from '@/components/links/ArrowLink';
import ButtonLink from '@/components/links/ButtonLink';
import UnderlineLink from '@/components/links/UnderlineLink';
import UnstyledLink from '@/components/links/UnstyledLink';

import { MdAccountBalance } from "react-icons/md";
import { MdOutlineFlashOn } from "react-icons/md";
import { MdLockPerson } from "react-icons/md";
import { IconContext } from "react-icons";


/**
 * SVGR Support
 * Caveat: No React Props Type.
 *
 * You can override the next-env if the type is important to you
 * @see https://stackoverflow.com/questions/68103844/how-to-override-next-js-svg-module-declaration
 */
import Logo from '~/svg/Logo.svg';
import Button from '@/components/buttons/Button';
import { Field, IFormValues } from '@/components/Field';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import QRCode from 'react-qr-code';
import { useState } from 'react';
import { useEffect } from 'react';
import generateQrCodeValue from '@/lib/qr';
import { isValidIBAN } from '@/lib/iban';
import { validate } from 'superstruct';
import { FormContainer, TextFieldElement } from 'react-hook-form-mui'


// !STARTERCONF -> Select !STARTERCONF and CMD + SHIFT + F
// Before you begin editing, follow all comments with `STARTERCONF`,
// to customize the default configuration.


export default function HomePage() {
  const [qrValue, setQrValue] = useState("");
  const [error, setError] = useState(true);

  const { register, handleSubmit, watch, formState, formState: { errors } } = useForm<IFormValues>({
    mode: 'onChange',
    shouldFocusError: false,
    shouldUseNativeValidation: true,
  });

  useEffect(() => {
    console.log(formState)
    setError(!formState.isValid)
  }, [formState])

  const onSubmit: SubmitHandler<IFormValues> = data => {
    console.log('changed');
    const res = generateQrCodeValue(data.iban, parseFloat(data.amount), data.recipient, data.usage);
    setQrValue(res);
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
            {!error && <QRCode value={qrValue} level='M' />}
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