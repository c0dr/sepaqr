interface IbanCountry {
  length: number,
  BBANRegex: string,
  BBANValidation?: (bban: string) => boolean,
}

const isValidIBAN = (iban: string): boolean => {

  iban = iban.split(" ").join("");

  const country = iban.substring(0, 2);
  if (!(country in COUNTRIES)) {
    return false;
  }
  const config = COUNTRIES[country];
  if (iban.length != config.length) {

    return false;
  }

  const regex = new RegExp(config.BBANRegex);
  const bban = iban.match(regex);


  if (bban?.length !== 1) {
    return false;
  }
  if (!mod97CheckIBAN(iban)) {
    return false;
  }

  //IBAN is valid, so we need to check BBAN next, if that country supports it


  if (config.BBANValidation) {
    console.log(bban)
    return config.BBANValidation(bban[0]);
  } else {
    return true;
  }

}


const mod97CheckBBAN = (bban: string): boolean => {
  console.log('bban ', bban)
  const mod = BigInt(bban) % BigInt(97);
  return mod === BigInt(1)
}


const mod97CheckString = (text: string): boolean => {
  let digits = "";

  for (const char of text) {
    if (/[0-9]/.test(char)) {
      digits += char;
    } else {
      // A = 65, but we want A=10
      digits += "" + ((char.codePointAt(0) || 55) - 55).toString();
    }
  }

  const number = BigInt(digits);

  return number % BigInt(97) == BigInt(1);
}

const mod97CheckIBAN = (iban: string): boolean => {
  iban = iban.substring(4, iban.length).concat(iban.substring(0, 4));
  return mod97CheckString(iban);
}




//BBAN validation






const validateIBAN = (iban: string): (string | Error) => {

  if (isValidIBAN(iban)) {
    return iban;
  } else {
    return new Error("invalid IBAN");
  }
}

const COUNTRIES: Record<string, IbanCountry> = {
  AD: {
    length: 24,
    BBANRegex: '[0-9]{8}[A-Z0-9]{12}$',
  },
  AT: {
    length: 20,
    BBANRegex: '[0-9]{16}$',
  },
  BE: {
    length: 16,
    BBANRegex: '[0-9]{12}$',
  },
  BG: {
    length: 16,
    BBANRegex: '[A-Z]{4}[0-9]{6}[A-Z0-9]{8}$',
  },
  CH: {
    length: 21,
    BBANRegex: '[0-9]{5}[0-9A-Z]{12}$',
  },
  CY: {
    length: 28,
    BBANRegex: '[0-9]{8}[0-9A-Z]{16}$',
  },
  CZ: {
    length: 24,
    BBANRegex: '[0-9]{20}$',
  },
  DE: {
    length: 22,
    BBANRegex: '[0-9]{18}$',
  },
  DK: {
    length: 18,
    BBANRegex: '[0-9]{14}$',
  },
  EE: {
    length: 20,
    BBANRegex: '[0-9]{16}$',
  },
  ES: {
    length: 24,
    BBANRegex: '[0-9]{20}$',
  },
  FI: {
    length: 18,
    BBANRegex: '[0-9]{14}$',
  },
  FR: {
    length: 27,
    BBANRegex: '[0-9]{10}[0-9A-Z]{11}[0-9]{2)$',
  },
  GB: {
    length: 22,
    BBANRegex: '[A-Z]{4}[0-9]{14}$',
  },
  GI: {
    length: 23,
    BBANRegex: '[A-Z]{4}[0-9A-Z]{15}$'
  },
  GR: {
    length: 27,
    BBANRegex: '[0-9]{7}[0-9A-Z]{16}$'
  },
  HR: {
    length: 21,
    BBANRegex: '[0-9]{17}$'
  },
  HU: {
    length: 28,
    BBANRegex: '[0-9]{24}$'
  },
  IE: {
    length: 28,
    BBANRegex: '[A-Z]{4}[0-9]{14}$'
  },
  IS: {
    length: 26,
    BBANRegex: '[0-9]{22}$'
  },
  IT: {
    length: 23,
    BBANRegex: '[A-Z]{1}[0-9]{10}[A-Z0-9]{12}$'
  },
  LI: {
    length: 21,
    BBANRegex: '[0-9]{5}[0-9A-Z]{12}$'
  },
  LT: {
    length: 20,
    BBANRegex: '[0-9]{16}$'
  },
  LU: {
    length: 20,
    BBANRegex: '[0-9]{3}[0-9A-Z]{13}$'
  },
  LV: {
    length: 21,
    BBANRegex: '[A-Z]{4}[0-9A-Z]{13}$'
  },
  MC: {
    length: 27,
    BBANRegex: '[0-9]{10}[0-9A-Z]{11}[0-9]{2}$'
  },
  MT: {
    length: 31,
    BBANRegex: '[A-Z]{4}[0-9]{5}[0-9A-Z]{18}$'
  },
  NL: {
    length: 18,
    BBANRegex: '[A-Z]{4}[0-9]{10}$'
  },
  NO: {
    length: 15,
    BBANRegex: '[0-9]{11}$'
  },
  PL: {
    length: 28,
    BBANRegex: '[0-9]{24}$'
  },
  PT: {
    length: 25,
    BBANRegex: '[0-9]{21}$',
    BBANValidation: mod97CheckBBAN
  },
  RO: {
    length: 24,
    BBANRegex: '[A-Z]{4}[0-9A-Z]{14}$' //incorrect?
  },
  SE: {
    length: 20,
    BBANRegex: '[0-9]{20}$' //incorrect?
  },
  SI: {
    length: 15, //incorrect?
    BBANRegex: '[0-9]{15}$',
    BBANValidation: mod97CheckBBAN
  },
  SK: {
    length: 20, //incorrect?
    BBANRegex: '[0-9]{20}$'
  },
  SM: {
    length: 27,
    BBANRegex: '[A-Z]{1}[0-9]{10}[0-9A-Z]{12}$'
  }
}



export {
  isValidIBAN,
  validateIBAN
};

