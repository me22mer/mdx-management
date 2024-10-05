import { NextResponse } from 'next/server'
import { put, del, list } from '@vercel/blob'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const path = searchParams.get('path')

  if (!path) {
    return NextResponse.json({ error: 'path is required' }, { status: 400 })
  }

  try {
    const blobs = await list({ prefix: path })
    return NextResponse.json(blobs)
  } catch (error) {
    console.error('Error listing files:', error)
    return NextResponse.json({ error: 'Failed to list files' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const { path, content } = await request.json()

  if (!path || !content) {
    return NextResponse.json({ error: 'path and content are required' }, { status: 400 })
  }

  try {
    const blob = await put(path, content, { access: 'public' })
    return NextResponse.json({ url: blob.url })
  } catch (error) {
    console.error('Error creating/updating file:', error)
    return NextResponse.json({ error: 'Failed to create/update file' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  const { fromUrl, toPathname, content } = await request.json();

  if (!fromUrl || !toPathname || content === undefined) {
    return NextResponse.json({ error: 'fromUrl, toPathname, and content are required' }, { status: 400 });
  }

  try {
    const blob = await put(toPathname, content, { 
      access: 'public',
      addRandomSuffix: false,
    });
    return NextResponse.json(blob);
  } catch (error) {
    console.error('Error updating file:', error);
    return NextResponse.json({ error: 'Failed to update file' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { url } = await request.json()

  if (!url) {
    return NextResponse.json({ error: 'url is required' }, { status: 400 })
  }

  try {
    await del(url)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting file:', error)
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 })
  }
}
