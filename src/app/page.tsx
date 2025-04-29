'use client';

import { Turnstile } from '@marsidev/react-turnstile';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { IconContext } from 'react-icons';
import {
  MdAccountBalance,
  MdCameraAlt,
  MdCreditCard,
  MdEdit,
  MdOutlineFlashOn,
  MdQrCode2,
  MdRestartAlt,
  MdTextFields,
} from 'react-icons/md';

import { isValidIBAN } from '@/lib/iban';
import { useToast } from '@/hooks/use-toast';

import { Field, IFormValues } from '@/components/Field';
import UnderlineLink from '@/components/links/UnderlineLink';
import { SepaQR } from '@/components/SEPAQR';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function HomePage() {
  const [formData, setFormData] = useState<{
    iban?: string;
    amount?: number;
    recipient?: string;
    usage?: string;
  }>();
  const [error, setError] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('manual');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const { toast } = useToast();
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<'text' | 'image' | null>(
    null
  );

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
    setValue,
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

  const handleVerification = (token: string) => {
    setTurnstileToken(token);
    setShowVerificationDialog(false);

    // Execute the pending action
    if (pendingAction === 'text' && analysisText) {
      executeTextAnalysis(analysisText, token);
    } else if (pendingAction === 'image' && selectedImage) {
      executeImageAnalysis(token);
    }

    setPendingAction(null);
  };

  const handleAnalyzeText = async (text: string) => {
    if (!text) return;

    if (!updateRateLimit()) {
      toast({
        title: 'Limit erreicht',
        description: `Das Tageslimit von ${DAILY_LIMIT} Analysen wurde erreicht. Bitte versuchen Sie es morgen wieder.`,
        variant: 'destructive',
      });
      return;
    }

    if (!turnstileToken) {
      setPendingAction('text');
      setShowVerificationDialog(true);
      return;
    }

    executeTextAnalysis(text, turnstileToken);
  };

  const executeTextAnalysis = async (text: string, token: string) => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          turnstileToken: token,
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.iban) setValue('iban', data.iban);
      if (data.amount) setValue('amount', data.amount.toString());
      if (data.recipient) setValue('recipient', data.recipient);
      if (data.usage) setValue('usage', data.usage);
      // Trigger form validation and update
      const formValues = form.getValues();
      updateFormData(formValues);

      // Switch back to the manual tab to review the information
      setActiveTab('manual');

      toast({
        title: 'Erfolgreiche Analyse',
        description: 'Zahlungsinformationen wurden erfolgreich extrahiert',
        variant: 'success',
        className: 'bg-green-100 border-green-400 text-green-800 font-medium',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to analyze text. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyzeImage = async () => {
    if (!selectedImage) return;

    if (!updateRateLimit()) {
      toast({
        title: 'Limit erreicht',
        description: `Das Tageslimit von ${DAILY_LIMIT} Analysen wurde erreicht. Bitte versuchen Sie es morgen wieder.`,
        variant: 'destructive',
      });
      return;
    }

    if (!turnstileToken) {
      setPendingAction('image');
      setShowVerificationDialog(true);
      return;
    }

    executeImageAnalysis(turnstileToken);
  };

  const executeImageAnalysis = async (token: string) => {
    setIsAnalyzing(true);
    try {
      if (!selectedImage) return;

      // Convert to base64
      const reader = new FileReader();
      reader.readAsDataURL(selectedImage);

      reader.onloadend = async () => {
        const base64data = reader.result as string;
        // Remove data:image/jpeg;base64, prefix
        const base64content = base64data.split(',')[1];

        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image: base64content,
            turnstileToken: token,
          }),
        });

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        if (data.iban) setValue('iban', data.iban);
        if (data.amount) setValue('amount', data.amount.toString());
        if (data.recipient) setValue('recipient', data.recipient);

        // Trigger form validation and update
        const formValues = form.getValues();
        updateFormData(formValues);

        // Switch back to the manual tab to review the information
        setActiveTab('manual');

        toast({
          title: 'Erfolgreiche Analyse',
          description: 'Zahlungsinformationen wurden aus dem Bild extrahiert',
          variant: 'success',
        });

        setIsAnalyzing(false);
        resetImageUpload();
      };
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Bildanalyse fehlgeschlagen. Bitte manuell versuchen.',
        variant: 'destructive',
      });
      setIsAnalyzing(false);
      resetImageUpload();
    }
  };

  const resetImageUpload = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const [analysisText, setAnalysisText] = useState('');

  // Rate limiting state and constants
  const DAILY_LIMIT = 10;
  const STORAGE_KEY = 'analysis_requests';
  const [, setRemainingRequests] = useState(DAILY_LIMIT);

  // Initialize and check rate limiting on component mount
  useEffect(() => {
    const checkRateLimit = () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            count: 0,
            date: new Date().toDateString(),
          })
        );
        setRemainingRequests(DAILY_LIMIT);
        return true;
      }

      const { count, date } = JSON.parse(stored);
      const today = new Date().toDateString();

      if (date !== today) {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            count: 0,
            date: today,
          })
        );
        setRemainingRequests(DAILY_LIMIT);
        return true;
      }

      setRemainingRequests(DAILY_LIMIT - count);
      return count < DAILY_LIMIT;
    };

    checkRateLimit();
  }, []);

  const updateRateLimit = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const today = new Date().toDateString();

    if (!stored) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          count: 1,
          date: today,
        })
      );
      setRemainingRequests(DAILY_LIMIT - 1);
      return true;
    }

    const { count, date } = JSON.parse(stored);

    if (date !== today) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          count: 1,
          date: today,
        })
      );
      setRemainingRequests(DAILY_LIMIT - 1);
      return true;
    }

    if (count >= DAILY_LIMIT) {
      return false;
    }

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        count: count + 1,
        date: today,
      })
    );
    setRemainingRequests(DAILY_LIMIT - (count + 1));
    return true;
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
        </div>

        <div className='mx-auto w-full max-w-2xl'>
          <Dialog
            open={showVerificationDialog}
            onOpenChange={setShowVerificationDialog}
          >
            <DialogContent className='sm:max-w-[425px]'>
              <DialogHeader>
                <DialogTitle>Sicherheitsüberprüfung</DialogTitle>
                <DialogDescription>
                  Bitte bestätigen Sie, dass Sie kein Robot sind.
                </DialogDescription>
              </DialogHeader>
              <div className='flex justify-center'>
                <Turnstile
                  siteKey='1x00000000000000000000AA'
                  onSuccess={handleVerification}
                  options={{
                    theme: 'light',
                  }}
                />
              </div>
            </DialogContent>
          </Dialog>

          <div className='bg-card text-card-foreground rounded-lg border p-6 shadow-lg'>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className='w-full'
            >
              <TabsList className='mb-8 grid h-16 w-full grid-cols-3'>
                <TabsTrigger
                  value='manual'
                  className='flex items-center justify-center gap-2 py-3 text-base'
                >
                  <MdEdit className='h-5 w-5' />
                  Manuell eingeben
                </TabsTrigger>
                <TabsTrigger
                  value='ai'
                  className='flex items-center justify-center gap-2 py-3 text-base'
                >
                  <MdTextFields className='h-5 w-5' />
                  Text analysieren
                </TabsTrigger>
                <TabsTrigger
                  value='image'
                  className='flex items-center justify-center gap-2 py-3 text-base'
                >
                  <MdCameraAlt className='h-5 w-5' />
                  Bild hochladen
                </TabsTrigger>
              </TabsList>

              <div className='min-h-[320px]'>
                <TabsContent value='manual' className='mt-0'>
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
                </TabsContent>

                <TabsContent value='ai' className='mt-0 space-y-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='text-input'>
                      Zahlungsdetails als Text eingeben
                    </Label>
                    <textarea
                      id='text-input'
                      placeholder="z.B. 'Überweise 50 EUR an Max Mustermann, IBAN: DE89370400440532013000'"
                      className='border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[100px] w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                      maxLength={500}
                      value={analysisText}
                      onChange={(e) => setAnalysisText(e.target.value)}
                    />
                    <div className='space-y-2 text-sm'>
                      <p className='text-muted-foreground'>
                        Geben Sie die Zahlungsdetails in natürlicher Sprache
                        ein. Die KI wird automatisch IBAN, Betrag und Empfänger
                        extrahieren.
                      </p>
                      <p className='text-muted-foreground/80 border-muted border-l-2 pl-2 text-xs'>
                        Hinweis: Die eingegebenen Daten werden zur Analyse an
                        unsere Server und KI-Dienstleister übermittelt.
                      </p>
                    </div>
                    <div className='pt-2'>
                      <Button
                        onClick={() => handleAnalyzeText(analysisText)}
                        disabled={!analysisText || isAnalyzing}
                        className='w-full'
                      >
                        {isAnalyzing ? 'Analysiere...' : 'Text analysieren'}
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value='image' className='mt-0 space-y-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='image-input'>
                      Foto einer Rechnung oder Überweisung hochladen
                    </Label>

                    {!imagePreview ? (
                      <div className='border-input relative flex flex-col items-center justify-center rounded-md border-2 border-dashed p-6'>
                        <MdCameraAlt className='text-muted-foreground mb-2 h-8 w-8' />
                        <p className='text-muted-foreground mb-2 text-sm'>
                          Klicken Sie hier, um ein Bild hochzuladen
                        </p>
                        <p className='text-muted-foreground/80 text-xs'>
                          Unterstützte Formate: JPEG, PNG, GIF
                        </p>
                        <input
                          id='image-input'
                          type='file'
                          accept='image/*'
                          onChange={handleImageUpload}
                          className='absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0'
                        />
                      </div>
                    ) : (
                      <div className='relative'>
                        <img
                          src={imagePreview}
                          alt='Vorschau'
                          className='h-auto max-h-[200px] w-full rounded-md object-cover'
                        />
                        <Button
                          onClick={resetImageUpload}
                          variant='destructive'
                          size='sm'
                          className='absolute right-2 top-2'
                        >
                          <MdRestartAlt className='h-4 w-4' />
                        </Button>
                      </div>
                    )}

                    <div className='space-y-2 text-sm'>
                      <p className='text-muted-foreground'>
                        Laden Sie ein Foto hoch, das Zahlungsdetails enthält.
                        Die KI wird versuchen, IBAN, Betrag und Empfänger zu
                        erkennen.
                      </p>
                      <p className='text-muted-foreground/80 border-muted border-l-2 pl-2 text-xs'>
                        Hinweis: Die hochgeladenen Bilder werden zur Analyse an
                        unsere Server und KI-Dienstleister übermittelt.
                      </p>
                    </div>

                    <div className='pt-2'>
                      <Button
                        onClick={handleAnalyzeImage}
                        disabled={!selectedImage || isAnalyzing}
                        className='w-full'
                      >
                        {isAnalyzing
                          ? 'Analysiere Bild...'
                          : 'Bild analysieren'}
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
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

        <div className='m-2 border border-gray-200 p-3'>
          <span className='text text-xs text-gray-700'>
            Werbung für meine andere Seite:{' '}
          </span>
          <UnderlineLink
            href='https://cardonly.de'
            className='flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-gray-900'
          >
            <MdCreditCard className='h-5 w-5' />
            Finde deine passende Kreditkarte oder Bankkonto auf CardOnly.de
          </UnderlineLink>
        </div>

        <footer className='text-muted-foreground text-center text-sm'>
          Made with ❤️ in Stuttgart.{' '}
          <UnderlineLink href='https://github.com/c0dr/sepaqr'>
            Open Source on GitHub
          </UnderlineLink>
          .
        </footer>
      </div>
    </main>
  );
}
