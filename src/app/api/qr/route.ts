import { NextResponse } from 'next/server';
import * as QRCode from 'qrcode';

import { isValidIBAN } from '@/lib/iban';

interface QRRequestBody {
  iban: string;
  amount?: number;
  recipient: string;
  usage?: string;
}

export async function POST(req: Request) {
  try {
    const body: QRRequestBody = await req.json();

    // Validate required fields
    if (!body.iban || !body.recipient) {
      return NextResponse.json(
        { error: 'IBAN and recipient are required' },
        { status: 400 }
      );
    }

    // Validate IBAN format
    if (!isValidIBAN(body.iban)) {
      return NextResponse.json(
        { error: 'Invalid IBAN format' },
        { status: 400 }
      );
    }

    // Validate amount if provided
    if (body.amount !== undefined && (isNaN(body.amount) || body.amount <= 0)) {
      return NextResponse.json(
        { error: 'Amount must be a positive number' },
        { status: 400 }
      );
    }

    // Format SEPA transfer data
    const sepaData = `BCD
001
1
SCT
${body.recipient}
${body.iban.replace(/\s/g, '')}
EUR${body.amount ? body.amount.toFixed(2) : ''}
${body.usage || ''}`;

    // Generate QR code as PNG buffer
    const qrBuffer = await QRCode.toBuffer(sepaData, {
      errorCorrectionLevel: 'M',
      width: 400,
      margin: 4,
    });

    // Return PNG image
    return new NextResponse(qrBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': 'inline; filename="sepa-qr.png"',
      },
    });
  } catch (error) {
    // Return error message without logging in production
    // In production, you would log to a monitoring service
    return NextResponse.json(
      {
        error: 'Failed to generate QR code',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
