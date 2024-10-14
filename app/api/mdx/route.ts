import { NextResponse } from 'next/server'
import { serialize } from 'next-mdx-remote/serialize'

export async function POST(request: Request) {
  const { content } = await request.json()
  const compiledSource = await serialize(content)
  return NextResponse.json(compiledSource)
}