"use client";

import React from "react";
import dynamic from "next/dynamic";
import type { MDXRemoteSerializeResult } from "next-mdx-remote";
import { MDXCarousel } from "@/app/components/mdx/carousel";
import { MDXImage } from "@/app/components/mdx/image";
import { MDXMetadata } from "@/app/components/mdx/metadata";

const MDXRemote = dynamic(() =>
  import("next-mdx-remote").then((mod) => mod.MDXRemote)
);

interface PreviewComponentProps {
  compiledSource: MDXRemoteSerializeResult | null;
}

export function PreviewComponent({ compiledSource }: PreviewComponentProps) {
  return (
    <main className="container mx-auto px-4 py-16">
      <article className="max-w-3xl mx-auto prose prose-zinc prose-lg prose-img:rounded-xl prose-headings:font-bold prose-a:text-blue-600">
        {compiledSource && (
          <MDXRemote
            {...compiledSource}
            components={{
              MDXCarousel,
              MDXImage,
              MDXMetadata,
            }}
          />
        )}
      </article>
    </main>
  );
}