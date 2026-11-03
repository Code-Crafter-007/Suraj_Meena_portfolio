import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { verifyAdminSessionToken } from '@/lib/auth';
import { getProjects, saveProject, deleteProject } from '@/lib/cms';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('admin_session')?.value;
  if (!verifyAdminSessionToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const projects = await getProjects(false);
    return NextResponse.json({ projects });
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to fetch projects', details: String(err) },
      { status: 500 }
    );
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
      return NextResponse.json({ error: 'Project title is required' }, { status: 400 });
    }

    const saved = await saveProject(body);

    // On-demand revalidation
    try {
      revalidatePath('/');
      revalidatePath('/projects');
      if (saved.slug) {
        revalidatePath(`/projects/${saved.slug}`);
      }
    } catch (revErr) {
      console.warn('Revalidation warning:', revErr);
    }

    return NextResponse.json({ success: true, project: saved });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to save project', details: String(err) }, { status: 500 });
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
    return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
  }

  try {
    await deleteProject(id);

    try {
      revalidatePath('/');
      revalidatePath('/projects');
    } catch (revErr) {
      console.warn('Revalidation warning:', revErr);
    }

    return NextResponse.json({ success: true, id });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete project', details: String(err) }, { status: 500 });
  }
}

