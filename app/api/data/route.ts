import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { list, put, del } from '@vercel/blob'
import { authOptions } from '@/lib/auth'

const authenticateAdmin = async () => {
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new Error('Unauthorized')
  }
  return session
}

export async function GET(request: NextRequest) {
  try {
    await authenticateAdmin()
    const { searchParams } = new URL(request.url)
    const path = searchParams.get('path')
    if (!path) {
      return NextResponse.json({ error: 'Path is required' }, { status: 400 })
    }
    const { blobs } = await list({ prefix: path })
    return NextResponse.json({ blobs })
  } catch (error) {
    console.error('GET Error:', error)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await authenticateAdmin()
    const { path, content } = await request.json()
    if (!path || !content) {
      return NextResponse.json({ error: 'Path and content are required' }, { status: 400 })
    }
    const blob = await put(path, content, { access: 'public' })
    return NextResponse.json({ success: true, blob })
  } catch (error) {
    console.error('POST Error:', error)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await authenticateAdmin()
    const { url } = await request.json()
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }
    await del(url)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE Error:', error)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}