export async function getContent(slug: string[]): Promise<string | null> {
  const response = await fetch(
    `/api/github?path=app/content/${slug.join("/")}/page.mdx`,
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
