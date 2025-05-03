'use client';

import Link from 'next/link';
import {
  MdCode,
  MdGradient,
  MdHome,
  MdList,
  MdPlayArrow,
  MdRule,
  MdSettings,
} from 'react-icons/md';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ApiDocumentation() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div>
      {/* Navigation Bar */}
      <nav className='bg-background/80 sticky top-0 z-10 border-b backdrop-blur-md'>
        <div className='mx-auto max-w-6xl px-4'>
          <div className='flex items-center gap-6 overflow-x-auto py-4 text-sm'>
            <Link
              href='/'
              className='text-muted-foreground hover:text-foreground mr-4 flex items-center gap-2 transition-colors'
            >
              <MdHome className='h-5 w-5' />
              <span className='font-medium'>Home</span>
            </Link>
            <div className='bg-border h-6 w-px' /> {/* Divider */}
            {[
              {
                id: 'overview',
                label: 'Overview',
                icon: <MdGradient className='h-4 w-4' />,
              },
              {
                id: 'endpoint',
                label: 'Endpoint',
                icon: <MdPlayArrow className='h-4 w-4' />,
              },
              {
                id: 'parameters',
                label: 'Parameters',
                icon: <MdList className='h-4 w-4' />,
              },
              {
                id: 'examples',
                label: 'Examples',
                icon: <MdCode className='h-4 w-4' />,
              },
              {
                id: 'responses',
                label: 'Responses',
                icon: <MdRule className='h-4 w-4' />,
              },
              {
                id: 'guidelines',
                label: 'Guidelines',
                icon: <MdSettings className='h-4 w-4' />,
              },
            ].map(({ id, label, icon }) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className='text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors'
              >
                {icon}
                {label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className='prose prose-slate dark:prose-invert mx-auto max-w-4xl px-4 py-8'>
        <div className='mb-12 space-y-2'>
          <h1 className='text-4xl font-bold'>SEPA QR Code Generation API</h1>
          <p className='text-muted-foreground text-lg'>
            Create scannable QR codes for SEPA bank transfers in seconds
          </p>
        </div>

        {/* Overview Section */}
        <section id='overview' className='mb-16 scroll-mt-20'>
          <h2 className='mb-4 text-2xl font-semibold'>Overview</h2>
          <div className='bg-muted/50 rounded-lg border p-6'>
            <p className='text-muted-foreground mb-4 text-lg'>
              Generate QR codes for SEPA bank transfers that can be easily
              scanned by mobile banking apps. Perfect for invoices, donation
              pages, or any situation where you need to share payment details.
            </p>
            <div className='mt-6 grid grid-cols-1 gap-4 md:grid-cols-3'>
              <div className='bg-background rounded border p-4'>
                <h3 className='mb-2 font-semibold'>Simple Integration</h3>
                <p className='text-muted-foreground text-sm'>
                  Just one API endpoint with straightforward parameters
                </p>
              </div>
              <div className='bg-background rounded border p-4'>
                <h3 className='mb-2 font-semibold'>SEPA Compatible</h3>
                <p className='text-muted-foreground text-sm'>
                  Generated QR codes follow the SEPA standard format
                </p>
              </div>
              <div className='bg-background rounded border p-4'>
                <h3 className='mb-2 font-semibold'>Instant Response</h3>
                <p className='text-muted-foreground text-sm'>
                  Get your QR code immediately as a PNG image
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Endpoint Details */}
        <section id='endpoint' className='mb-16 scroll-mt-20'>
          <h2 className='mb-4 text-2xl font-semibold'>Endpoint Details</h2>
          <div className='bg-muted space-y-4 rounded-lg border p-6'>
            <div className='flex items-center gap-4'>
              <span className='rounded bg-green-500/10 px-2 py-1 text-sm font-semibold text-green-700 dark:text-green-400'>
                POST
              </span>
              <code className='text-lg'>/api/qr</code>
            </div>
            <div className='space-y-2'>
              <p className='font-medium'>Headers:</p>
              <pre className='bg-background rounded border p-3 text-sm'>
                Content-Type: application/json
              </pre>
            </div>
          </div>
        </section>

        {/* Request Parameters */}
        <section id='parameters' className='mb-16 scroll-mt-20'>
          <h2 className='mb-4 text-2xl font-semibold'>Request Parameters</h2>
          <div className='overflow-x-auto'>
            <table className='bg-muted w-full border-collapse overflow-hidden rounded-lg'>
              <thead>
                <tr className='bg-muted-foreground/5'>
                  <th className='p-4 text-left font-semibold'>Parameter</th>
                  <th className='p-4 text-left font-semibold'>Type</th>
                  <th className='p-4 text-left font-semibold'>Required</th>
                  <th className='p-4 text-left font-semibold'>Description</th>
                </tr>
              </thead>
              <tbody className='divide-border divide-y'>
                <tr>
                  <td className='p-4'>
                    <code>iban</code>
                  </td>
                  <td className='p-4'>string</td>
                  <td className='p-4'>Yes</td>
                  <td className='p-4'>Valid IBAN number (spaces allowed)</td>
                </tr>
                <tr>
                  <td className='p-4'>
                    <code>amount</code>
                  </td>
                  <td className='p-4'>number</td>
                  <td className='p-4'>No</td>
                  <td className='p-4'>Transfer amount in euros</td>
                </tr>
                <tr>
                  <td className='p-4'>
                    <code>recipient</code>
                  </td>
                  <td className='p-4'>string</td>
                  <td className='p-4'>Yes</td>
                  <td className='p-4'>Name of the payment recipient</td>
                </tr>
                <tr>
                  <td className='p-4'>
                    <code>usage</code>
                  </td>
                  <td className='p-4'>string</td>
                  <td className='p-4'>No</td>
                  <td className='p-4'>Payment reference or purpose</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Examples */}
        <section id='examples' className='mb-16 scroll-mt-20'>
          <h2 className='mb-4 text-2xl font-semibold'>Examples</h2>
          <div className='bg-muted rounded-lg border p-6'>
            <Tabs defaultValue='javascript' className='w-full'>
              <TabsList className='mb-4'>
                <TabsTrigger value='javascript'>JavaScript</TabsTrigger>
                <TabsTrigger value='curl'>cURL</TabsTrigger>
              </TabsList>

              <TabsContent value='javascript'>
                <pre className='bg-background overflow-x-auto rounded-md border p-4'>
                  <code className='text-sm'>{`const response = await fetch('/api/qr', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    iban: 'DE89 3704 0044 0532 0130 00',
    amount: 50.00,
    recipient: 'John Doe',
    usage: 'Invoice 123'
  })
});

// Response is a PNG image
const qrCode = await response.blob();`}</code>
                </pre>
              </TabsContent>

              <TabsContent value='curl'>
                <pre className='bg-background overflow-x-auto rounded-md border p-4'>
                  <code className='text-sm'>{`curl -X POST \\
  http://your-domain/api/qr \\
  -H 'Content-Type: application/json' \\
  -d '{
    "iban": "DE89 3704 0044 0532 0130 00",
    "amount": 50.00,
    "recipient": "John Doe",
    "usage": "Invoice 123"
  }' \\
  --output qr-code.png`}</code>
                </pre>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Response Format */}
        <section id='responses' className='mb-16 scroll-mt-20'>
          <h2 className='mb-4 text-2xl font-semibold'>Response Format</h2>

          <div className='space-y-8'>
            <div className='bg-muted rounded-lg border p-6'>
              <h3 className='mb-4 text-xl font-semibold'>
                Successful Response
              </h3>
              <div className='space-y-2'>
                <p className='font-medium'>Headers:</p>
                <pre className='bg-background rounded border p-3 text-sm'>
                  Content-Type: image/png Content-Disposition: inline;
                  filename="sepa-qr.png"
                </pre>
                <p className='mt-4 font-medium'>Body:</p>
                <p className='text-muted-foreground'>
                  PNG image data containing the QR code
                </p>
              </div>
            </div>

            <div className='bg-muted rounded-lg border p-6'>
              <h3 className='mb-4 text-xl font-semibold'>Error Responses</h3>
              <div className='space-y-4'>
                <div>
                  <div className='mb-2 flex items-center gap-2'>
                    <span className='rounded bg-red-500/10 px-2 py-1 text-sm font-semibold text-red-700 dark:text-red-400'>
                      400
                    </span>
                    <span className='font-medium'>Invalid Parameters</span>
                  </div>
                  <pre className='bg-background rounded border p-3 text-sm'>{`{
  "error": "Invalid IBAN format"
}`}</pre>
                </div>
                <div>
                  <div className='mb-2 flex items-center gap-2'>
                    <span className='rounded bg-red-500/10 px-2 py-1 text-sm font-semibold text-red-700 dark:text-red-400'>
                      500
                    </span>
                    <span className='font-medium'>Server Error</span>
                  </div>
                  <pre className='bg-background rounded border p-3 text-sm'>{`{
  "error": "Failed to generate QR code"
}`}</pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Guidelines */}
        <section id='guidelines' className='scroll-mt-20'>
          <h2 className='mb-4 text-2xl font-semibold'>Usage Guidelines</h2>

          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <div className='bg-muted rounded-lg border p-6'>
              <h3 className='mb-4 text-xl font-semibold'>Validation Rules</h3>
              <ul className='space-y-3'>
                <li className='flex items-start gap-2'>
                  <span className='mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500'></span>
                  <span>IBAN must be a valid format (spaces allowed)</span>
                </li>
                <li className='flex items-start gap-2'>
                  <span className='mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500'></span>
                  <span>Amount must be a positive number</span>
                </li>
                <li className='flex items-start gap-2'>
                  <span className='mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500'></span>
                  <span>Recipient name is required</span>
                </li>
                <li className='flex items-start gap-2'>
                  <span className='mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500'></span>
                  <span>Reference/usage is optional</span>
                </li>
              </ul>
            </div>

            <div className='bg-muted rounded-lg border p-6'>
              <h3 className='mb-4 text-xl font-semibold'>Best Practices</h3>
              <ul className='space-y-3'>
                <li className='flex items-start gap-2'>
                  <span className='mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-green-500'></span>
                  <span>Always validate IBAN format before submission</span>
                </li>
                <li className='flex items-start gap-2'>
                  <span className='mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-green-500'></span>
                  <span>Use clear, descriptive recipient names</span>
                </li>
                <li className='flex items-start gap-2'>
                  <span className='mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-green-500'></span>
                  <span>Include specific references for easier tracking</span>
                </li>
                <li className='flex items-start gap-2'>
                  <span className='mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-green-500'></span>
                  <span>
                    Handle both successful and error responses appropriately
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
