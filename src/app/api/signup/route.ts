import { NextResponse } from 'next/server';
import { sendWelcomeEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const { email, os } = await req.json();

    if (!email || !os) {
      return NextResponse.json(
        { error: 'Email and OS are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate OS
    const validOS = ['mac', 'windows', 'linux'];
    if (!validOS.includes(os)) {
      return NextResponse.json(
        { error: 'Invalid OS specified' },
        { status: 400 }
      );
    }

    const result = await sendWelcomeEmail(email, os);

    return NextResponse.json({ 
      success: true,
      message: 'Check your email for the download link'
    });
  } catch (error: any) {
    console.error('Signup API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process signup',
        details: error.message 
      },
      { status: 500 }
    );
  }
} 