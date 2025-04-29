import QRCode from 'react-qr-code';

import { validateIBAN } from '@/lib/iban';
import generateQrCodeValue from '@/lib/qr';

export type SepaQrProps = {
  iban?: string;
  amount?: number;
  recipient?: string;
  usage?: string;
};

export const SepaQR = ({ amount, iban, recipient, usage }: SepaQrProps) => {
  if (!iban || !recipient) {
    return null;
  }

  const validationResult = validateIBAN(iban);
  if (validationResult instanceof Error) {
    return null;
  }

  const value = generateQrCodeValue(iban, amount, recipient, usage);

  return value ? (
    <div className='flex justify-center p-4'>
      <QRCode value={value} level='M' />
    </div>
  ) : null;
};
