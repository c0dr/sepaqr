import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'API Documentation - SEPA QR Generator',
  description:
    'API Documentation for SEPA QR Generator image generation service',
};

export default function ApiLayout({ children }: { children: React.ReactNode }) {
  return <div className='container mx-auto px-4 py-8'>{children}</div>;
}
