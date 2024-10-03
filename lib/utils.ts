import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export async function getContent(slug: string[]): Promise<string | null> {
  const baseUrl = process.env.GITHUB_TOKEN

  const response = await fetch(
    `${baseUrl}/api/github?path=app/content/${slug.join("/")}/page.mdx`,
    {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return data.content;
}
