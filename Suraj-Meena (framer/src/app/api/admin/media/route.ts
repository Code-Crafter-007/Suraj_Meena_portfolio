import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { verifyAdminSessionToken } from '@/lib/auth';
import { getMedia, saveMedia, updateMedia, deleteMedia } from '@/lib/cms';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('admin_session')?.value;
  if (!verifyAdminSessionToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const media = await getMedia();
    return NextResponse.json({ media });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch media', details: String(err) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get('admin_session')?.value;
  if (!verifyAdminSessionToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body.fileUrl || !body.fileName) {
      return NextResponse.json({ error: 'File URL and name are required' }, { status: 400 });
    }

    const saved = await saveMedia(body);

    try {
      revalidatePath('/', 'layout');
      if (saved.projectSlug) {
        revalidatePath(`/projects/${saved.projectSlug}`);
      }
    } catch {}

    return NextResponse.json({ success: true, media: saved });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to save media', details: String(err) }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const token = req.cookies.get('admin_session')?.value;
  if (!verifyAdminSessionToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, ...updates } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'Media ID is required' }, { status: 400 });
    }

    const updated = await updateMedia(id, updates);

    try {
      revalidatePath('/', 'layout');
      if (updated?.projectSlug) {
        revalidatePath(`/projects/${updated.projectSlug}`);
      }
    } catch {}

    return NextResponse.json({ success: true, media: updated });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update media', details: String(err) }, { status: 500 });
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
    return NextResponse.json({ error: 'Media ID is required' }, { status: 400 });
  }

  try {
    await deleteMedia(id);

    try {
      revalidatePath('/', 'layout');
    } catch {}

    return NextResponse.json({ success: true, id });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete media', details: String(err) }, { status: 500 });
  }
}

