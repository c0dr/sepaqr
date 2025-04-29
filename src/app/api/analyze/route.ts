import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
});

const verifyTurnstileToken = async (token: string) => {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    throw new Error('Missing TURNSTILE_SECRET_KEY');
  }

  const res = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret,
        response: token,
      }),
    }
  );

  const data = await res.json();
  return data.success;
};

export async function POST(req: Request) {
  try {
    const { text, image, turnstileToken } = await req.json();

    if (!turnstileToken) {
      return NextResponse.json(
        { error: 'Turnstile token required' },
        { status: 400 }
      );
    }

    const isValid = await verifyTurnstileToken(turnstileToken);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid Turnstile token' },
        { status: 400 }
      );
    }

    // Check if either text or image is provided
    if (!text && !image) {
      return NextResponse.json(
        { error: 'Either text or image is required' },
        { status: 400 }
      );
    }

    const messages = [];

    // System message is the same for both text and image
    messages.push({
      role: 'system',
      content: `You are a payment information extraction assistant. Extract payment information from the user's input.
      Use the generate_payment_data function to return the extracted information.`,
    });

    // Add user message with either text content or image content
    if (text) {
      messages.push({
        role: 'user',
        content: text,
      });
    } else if (image) {
      messages.push({
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Extract payment information from this image.',
          },
          {
            type: 'image_url',
            image_url: {
              url: `data:image/jpeg;base64,${image}`,
            },
          },
        ],
      });
    }

    const completion = await openai.chat.completions.create({
      model: 'google/gemini-flash-1.5-8b',
      messages,
      tools: [
        {
          type: 'function',
          function: {
            name: 'generate_payment_data',
            description:
              'Generate structured payment data from the extracted information',
            parameters: {
              type: 'object',
              properties: {
                iban: {
                  type: 'string',
                  description:
                    'IBAN number without spaces. If not found, use null.',
                },
                usage: {
                  type: 'string',
                  description:
                    'Payment reference for the tansfer. If not found, use null.',
                },
                amount: {
                  type: 'number',
                  description:
                    'Payment amount as a number. If not found, use null.',
                },
                recipient: {
                  type: 'string',
                  description:
                    'Name of the payment recipient. If not found, use null.',
                },
              },
              required: ['iban', 'recipient'],
            },
          },
        },
      ],
      tool_choice: {
        type: 'function',
        function: { name: 'generate_payment_data' },
      },
      temperature: 0.1, // Lower temperature for more focused extraction
    });

    const toolCall = completion.choices[0]?.message?.tool_calls?.[0];

    if (!toolCall) {
      throw new Error('No tool call found in response');
    }

    try {
      const args = JSON.parse(toolCall.function.arguments);

      // Clean up the IBAN by removing any remaining spaces
      if (args.iban) {
        args.iban = args.iban.replace(/\s/g, '');
      }

      // Ensure amount is a number if present
      if (args.amount !== null && typeof args.amount !== 'number') {
        args.amount = parseFloat(args.amount);
        if (isNaN(args.amount)) args.amount = null;
      }

      return NextResponse.json(args);
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Failed to parse AI response' },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to analyze text' },
      { status: 500 }
    );
  }
}
