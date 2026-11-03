import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { verifyAdminSessionToken } from '@/lib/auth';
import { getArticles, saveArticle, deleteArticle } from '@/lib/cms';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('admin_session')?.value;
  if (!verifyAdminSessionToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const articles = await getArticles(false);
    return NextResponse.json({ articles });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch articles', details: String(err) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get('admin_session')?.value;
  if (!verifyAdminSessionToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body.title) {
      return NextResponse.json({ error: 'Article title is required' }, { status: 400 });
    }

    const saved = await saveArticle(body);

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/thoughts');
      if (saved.slug) {
        revalidatePath(`/thoughts/${saved.slug}`);
      }
    } catch {}

    return NextResponse.json({ success: true, article: saved });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to save article', details: String(err) }, { status: 500 });
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
    return NextResponse.json({ error: 'Article ID is required' }, { status: 400 });
  }

  try {
    await deleteArticle(id);

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/thoughts');
    } catch {}

    return NextResponse.json({ success: true, id });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete article', details: String(err) }, { status: 500 });
  }
}

