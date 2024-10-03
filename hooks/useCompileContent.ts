import { useState, useCallback } from "react";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import { MDXCarousel } from "@/app/components/mdx-carousel";
import { MDXImage } from "@/app/components/mdx-image";

interface CompilationError {
  message: string;
  line?: number;
}

export function useCompileContent() {
  const [compiledContent, setCompiledContent] = useState<React.ReactNode | null>(null);
  const [compilationError, setCompilationError] = useState<CompilationError | null>(null);

  const compileContent = useCallback(async (mdxContent: string) => {
    const { content: mdxBody } = matter(mdxContent);
    try {
      const compiledJSX = await compileMDX({
        source: mdxBody,
        components: { MDXCarousel, MDXImage },
        options: { parseFrontmatter: true },
      });

      setCompilationError(null);
      setCompiledContent(compiledJSX.content);
    } catch (error) {
      console.error("Error compiling MDX:", error);
      let errorMessage = "Unknown error occurred";
      let errorLine: number | undefined;

      if (error instanceof Error) {
        errorMessage = error.message;
        const lineMatch = errorMessage.match(/$$(\d+):(\d+)$$/);
        if (lineMatch) {
          errorLine = parseInt(lineMatch[1], 10);
        }
      }

      setCompilationError({ message: errorMessage, line: errorLine });
      setCompiledContent(null);
    }
  }, []);

  return { compiledContent, compilationError, compileContent };
}
