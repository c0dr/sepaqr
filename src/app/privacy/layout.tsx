import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Datenschutzerklärung - SEPA QR Generator',
  description:
    'Datenschutzerklärung und Informationen zur Datenverarbeitung für SEPA QR Generator',
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
