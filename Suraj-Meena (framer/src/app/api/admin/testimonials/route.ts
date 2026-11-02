import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSessionToken } from '@/lib/auth';
import { getTestimonials, saveTestimonial, deleteTestimonial } from '@/lib/cms';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('admin_session')?.value;
  if (!verifyAdminSessionToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const testimonials = await getTestimonials();
  return NextResponse.json({ testimonials });
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get('admin_session')?.value;
  if (!verifyAdminSessionToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body.authorName || !body.quote) {
      return NextResponse.json({ error: 'Author name and quote are required' }, { status: 400 });
    }

    const saved = await saveTestimonial(body);
    return NextResponse.json({ success: true, testimonial: saved });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to save testimonial', details: String(err) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const token = req.cookies.get('admin_session')?.value;
  if (!verifyAdminSessionToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Testimonial ID is required' }, { status: 400 });
  }

  await deleteTestimonial(id);
  return NextResponse.json({ success: true, id });
}

