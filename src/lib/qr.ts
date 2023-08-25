const generateQrCodeValue = (iban: String, amount: number, recipient: String, usage: String) => {

  if (iban == "" || amount == 0 || recipient == "") {
    return ''
  }

  const SERVICE_TAG = "BCD";
  const VERSION = "002";
  const CHARACTER_SET = '1'
  const IDENTIFICATION_CODE = "SCT";
  const BIC = ""

  iban = iban.split(' ').join('');

  return [
    SERVICE_TAG,
    VERSION,
    CHARACTER_SET,
    IDENTIFICATION_CODE,
    BIC,
    recipient,
    iban,
    'EUR' + amount.toFixed(2),
    '',
    '',
    usage || '',
    ''
  ].join('\n')
}


export default generateQrCodeValue;