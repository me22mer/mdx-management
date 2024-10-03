"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getContent } from "@/lib/utils";
import { useCompileContent } from "@/hooks/useCompileContent";
import { Button } from "@/app/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/app/components/ui/textarea";

interface EditPageProps {
  params: { slug: string[] };
}

export default function EditPage({ params }: EditPageProps) {
  const [content, setContent] = useState<string>("");
  const [initialContent, setInitialContent] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("edit");
  const router = useRouter();
  const { toast } = useToast();
  const { compiledContent, compilationError, compileContent } = useCompileContent();

  useEffect(() => {
    const fetchContent = async () => {
      const cachedContent = sessionStorage.getItem(`page-content-${params.slug.join("/")}`);
      if (cachedContent) {
        setContent(cachedContent);
        setInitialContent(cachedContent);
        compileContent(cachedContent);
      } else {
        const fetchedContent = await getContent(params.slug);
        if (fetchedContent) {
          setContent(fetchedContent);
          setInitialContent(fetchedContent);
          compileContent(fetchedContent);
          sessionStorage.setItem(`page-content-${params.slug.join("/")}`, fetchedContent);
        } else {
          router.push("/not-found");
        }
      }
      setIsLoading(false);
    };

    fetchContent();
  }, [params.slug, router, compileContent]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (content !== initialContent) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [content, initialContent]);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/github", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: `app/content/${params.slug.join("/")}/page.mdx`,
          content,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save content");
      }

      toast({
        title: "Success",
        description: "Content saved successfully!",
      });
      setInitialContent(content);
      sessionStorage.setItem(`page-content-${params.slug.join("/")}`, content);
      router.refresh();
    } catch (error) {
      console.error("Error saving content:", error);
      toast({
        title: "Error",
        description: "Failed to save. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }, [content, params.slug, router, toast]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "preview") {
      compileContent(content);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{params.slug.join(" / ")}</h1>
      <div className="mb-4">
        <Button onClick={handleSave} disabled={isSaving || content === initialContent}>
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </div>
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList>
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="edit">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full min-h-[calc(100vh-300px)] p-2 font-mono"
            placeholder="Enter your MDX content here..."
          />
        </TabsContent>
        <TabsContent value="preview">
          <div className="border rounded-md p-4 min-h-[calc(100vh-300px)] prose max-w-none">
            {compilationError ? (
              <div className="text-red-500">
                <h2>Error rendering MDX content:</h2>
                <pre>{compilationError.message}</pre>
                {compilationError.line && <p>Error on line {compilationError.line}</p>}
                <p>Please check your MDX syntax and try again.</p>
              </div>
            ) : (
              <div className="container mx-auto px-4 py-16">
                <article className="max-w-3xl mx-auto prose prose-invert prose-zinc prose-lg prose-img:rounded-xl prose-headings:font-bold prose-a:text-blue-600">
                  {compiledContent}
                </article>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
