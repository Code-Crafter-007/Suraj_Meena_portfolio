import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { verifyAdminSessionToken } from '@/lib/auth';
import { getSiteSettings, saveSiteSettings } from '@/lib/cms';

export async function GET() {
  const settings = await getSiteSettings();
  return NextResponse.json({ settings });
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get('admin_session')?.value;
  if (!verifyAdminSessionToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const updated = await saveSiteSettings(body);

    try {
      revalidatePath('/', 'layout');
    } catch {}

    return NextResponse.json({ success: true, settings: updated });
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to update settings', details: String(err) },
      { status: 500 }
    );
  }
}
