export type SepaQrProps = {
  amount?: number;
  iban?: string,
  recipient?: string,
  usage?: string,
};

import QRCode from "react-qr-code";
import { validateIBAN } from "@/lib/iban";
import generateQrCodeValue from "@/lib/qr";

export const SepaQR = ({ amount, iban, recipient, usage }: SepaQrProps) => {
  if (!iban || !recipient) {
    return;
  }


  if (!validateIBAN(iban)) {
    return;
  }

  const value = generateQrCodeValue(iban, amount, recipient, usage);

  return (
    <QRCode value={value} level='M' />
  )

}
