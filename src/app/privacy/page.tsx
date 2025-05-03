import Link from 'next/link';
import * as React from 'react';

export const metadata = {
  title: 'Privacy Policy - SEPA QR Generator',
  description:
    'Privacy policy and data processing information for SEPA QR Generator',
};

export default function PrivacyPage() {
  return (
    <main className='bg-background min-h-screen'>
      <div className='container mx-auto max-w-3xl px-4 py-12'>
        <h1 className='mb-8 text-4xl font-bold'>Privacy Policy</h1>

        <div className='prose dark:prose-invert max-w-none'>
          <p className='mb-6 text-lg'>
            Last updated:{' '}
            {new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>

          <section className='mb-8'>
            <h2 className='mb-4 text-2xl font-semibold'>1. Introduction</h2>
            <p>
              This Privacy Policy explains how SEPA QR Generator ("we," "us," or
              "our") collects, uses, and protects your personal information when
              you use our service. We are committed to ensuring your privacy and
              protecting your data in compliance with the General Data
              Protection Regulation (GDPR).
            </p>
          </section>

          <section className='mb-8'>
            <h2 className='mb-4 text-2xl font-semibold'>
              2. Information We Collect
            </h2>
            <p>
              When you use our service, we collect and process the following
              data:
            </p>
            <ul className='mt-2 list-disc pl-6'>
              <li>
                Payment information you input (IBAN, recipient name, amount, and
                usage details)
              </li>
              <li>Images you upload for analysis</li>
              <li>Text content you submit for analysis</li>
            </ul>
          </section>

          <section className='mb-8'>
            <h2 className='mb-4 text-2xl font-semibold'>
              3. How We Use Your Information
            </h2>
            <p>We use your information solely for:</p>
            <ul className='mt-2 list-disc pl-6'>
              <li>Generating SEPA QR codes based on your input</li>
              <li>
                Analyzing submitted images and text to extract payment
                information
              </li>
              <li>Improving our service quality and user experience</li>
            </ul>
          </section>

          <section className='mb-8'>
            <h2 className='mb-4 text-2xl font-semibold'>
              4. Third-Party Services
            </h2>
            <h3 className='mb-3 text-xl font-semibold'>Cloudflare Turnstile</h3>
            <p>
              We use Cloudflare Turnstile for bot protection. When you interact
              with our service, Turnstile may collect and process certain data
              to verify that you are human. This data processing is governed by{' '}
              <a
                href='https://www.cloudflare.com/privacy/'
                className='text-primary hover:underline'
              >
                Cloudflare's Privacy Policy
              </a>
              .
            </p>

            <h3 className='mb-3 mt-4 text-xl font-semibold'>OpenRouter</h3>
            <p>
              We use OpenRouter for AI-powered analysis of images and text. When
              you submit content for analysis, it is processed through
              OpenRouter's API service. This processing is governed by{' '}
              <a
                href='https://openrouter.ai/privacy'
                className='text-primary hover:underline'
              >
                OpenRouter's Privacy Policy
              </a>
              .
            </p>
          </section>

          <section className='mb-8'>
            <h2 className='mb-4 text-2xl font-semibold'>
              5. Data Storage and Security
            </h2>
            <p>
              We do not store your payment information or uploaded content
              permanently. All data is processed in memory and discarded after
              generating the QR code or completing the analysis. We employ
              appropriate security measures to protect your data during
              processing.
            </p>
          </section>

          <section className='mb-8'>
            <h2 className='mb-4 text-2xl font-semibold'>
              6. Your Rights Under GDPR
            </h2>
            <p>Under GDPR, you have the following rights:</p>
            <ul className='mt-2 list-disc pl-6'>
              <li>The right to access your personal data</li>
              <li>The right to rectification of inaccurate personal data</li>
              <li>The right to erasure of your personal data</li>
              <li>The right to restrict processing of your personal data</li>
              <li>The right to data portability</li>
              <li>The right to object to processing of your personal data</li>
            </ul>
          </section>

          <section className='mb-8'>
            <h2 className='mb-4 text-2xl font-semibold'>
              7. Contact Information
            </h2>
            <p>
              For any privacy-related questions or to exercise your GDPR rights,
              please contact us at:{' '}
              <a
                href='mailto:privacy@example.com'
                className='text-primary hover:underline'
              >
                privacy@example.com
              </a>
            </p>
          </section>
        </div>

        <div className='mt-8'>
          <Link href='/' className='text-primary hover:underline'>
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
