import { NextRequest, NextResponse } from 'next/server';
import { saveContactMessage } from '@/lib/cms';

export async function POST(req: NextRequest) {
  try {
    const { name, email, project } = await req.json();

    if (!name || !email || !project) {
      return NextResponse.json(
        { error: 'Name, email, and project details are required' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    if (name.trim().length > 120 || project.trim().length > 5000) {
      return NextResponse.json(
        { error: 'Message payload exceeds reasonable length limit.' },
        { status: 400 }
      );
    }

    const saved = await saveContactMessage({
      name: name.trim(),
      email: email.trim(),
      projectDetails: project.trim(),
    });

    return NextResponse.json({ success: true, message: saved });
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to record inquiry', details: String(err) },
      { status: 500 }
    );
  }
}

