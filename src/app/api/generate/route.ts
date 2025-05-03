import { NextResponse } from 'next/server';
import sharp from 'sharp';

interface ImageParams {
  format: 'svg' | 'png';
  width?: number;
  height?: number;
  backgroundColor?: string;
  foregroundColor?: string;
}

function validateParams(params: unknown): params is ImageParams {
  if (!params || typeof params !== 'object') {
    return false;
  }

  const p = params as Record<string, unknown>;

  // Validate format
  if (!['svg', 'png'].includes(p.format as string)) {
    return false;
  }

  // Validate optional numeric parameters
  if (p.width !== undefined && (typeof p.width !== 'number' || p.width <= 0)) {
    return false;
  }

  if (
    p.height !== undefined &&
    (typeof p.height !== 'number' || p.height <= 0)
  ) {
    return false;
  }

  // Validate color parameters with hex color regex
  const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

  if (
    p.backgroundColor !== undefined &&
    (typeof p.backgroundColor !== 'string' ||
      !colorRegex.test(p.backgroundColor))
  ) {
    return false;
  }

  if (
    p.foregroundColor !== undefined &&
    (typeof p.foregroundColor !== 'string' ||
      !colorRegex.test(p.foregroundColor))
  ) {
    return false;
  }

  return true;
}

function generatePattern(
  width: number,
  height: number,
  foregroundColor: string
): string {
  const gridSize = Math.min(width, height) / 10;
  let pattern = '';

  // Create a grid pattern with circles
  for (let x = gridSize; x < width; x += gridSize * 2) {
    for (let y = gridSize; y < height; y += gridSize * 2) {
      pattern += `<circle cx="${x}" cy="${y}" r="${
        gridSize / 2
      }" fill="${foregroundColor}" opacity="0.8"/>`;
    }
  }

  return pattern;
}

function generateSVG(params: ImageParams): string {
  const width = params.width || 200;
  const height = params.height || 200;
  const backgroundColor = params.backgroundColor || '#ffffff';
  const foregroundColor = params.foregroundColor || '#000000';

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${backgroundColor};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${backgroundColor};stop-opacity:0.8" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg-gradient)"/>
  ${generatePattern(width, height, foregroundColor)}
</svg>`;
}

async function generatePNG(params: ImageParams): Promise<Buffer> {
  const svg = generateSVG(params);

  try {
    // Convert SVG to PNG using sharp
    const buffer = await sharp(Buffer.from(svg))
      .png()
      .resize({
        width: params.width || 200,
        height: params.height || 200,
        fit: 'contain',
        background: params.backgroundColor || '#ffffff',
      })
      .toBuffer();

    return buffer;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to convert SVG to PNG'
    );
  }
}

export async function POST(req: Request) {
  try {
    const params = await req.json();

    if (!validateParams(params)) {
      return NextResponse.json(
        {
          error:
            'Invalid parameters. Format must be "svg" or "png", and size parameters must be positive numbers.',
        },
        { status: 400 }
      );
    }

    try {
      if (params.format === 'svg') {
        const svg = generateSVG(params);
        return new NextResponse(svg, {
          status: 200,
          headers: {
            'Content-Type': 'image/svg+xml',
          },
        });
      } else {
        const png = await generatePNG(params);
        return new NextResponse(png, {
          status: 200,
          headers: {
            'Content-Type': 'image/png',
          },
        });
      }
    } catch (generationError) {
      // Log error details to monitoring service in production
      return NextResponse.json(
        {
          error: 'Failed to generate image',
          details:
            generationError instanceof Error
              ? generationError.message
              : 'Unknown error',
        },
        { status: 500 }
      );
    }
  } catch (error) {
    // Request parsing error, no need to log as it's a client error
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
