"use client";

import React from "react";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { EditToolbar } from "@/components/edit-toolbar";
import dynamic from "next/dynamic";
import { serialize } from "next-mdx-remote/serialize";
import type { MDXRemoteSerializeResult } from "next-mdx-remote";
// import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertTriangle, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useContentContext } from "@/app/contexts/content-context";
import { MDXCarousel } from "@/app/components/mdx/carousel";
import { MDXImage } from "@/app/components/mdx/image";

const MDXRemote = dynamic(() =>
  import("next-mdx-remote").then((mod) => mod.MDXRemote)
);

interface EditPageProps {
  params: { slug: string[] };
}

export default function EditPage({ params }: EditPageProps) {
  const [content, setContent] = useState("");
  const [originalContent, setOriginalContent] = useState("");
  const [compiledSource, setCompiledSource] =
    useState<MDXRemoteSerializeResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  // const router = useRouter()
  const { refreshSidebar } = useContentContext();

  const fetchMdxContent = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/data?path=content/${params.slug.join("/")}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.blobs && data.blobs.length > 0) {
        const mdxContent = await fetch(data.blobs[0].url).then((res) =>
          res.text()
        );
        setContent(mdxContent);
        setOriginalContent(mdxContent);
        await updatePreview(mdxContent);
      } else {
        const defaultContent = "# New Page\n\nStart writing your content here.";
        setContent(defaultContent);
        setOriginalContent(defaultContent);
        await updatePreview(defaultContent);
      }
    } catch (error) {
      console.error("Error fetching MDX content:", error);
      setError(
        `Failed to load content: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  }, [params.slug]);

  useEffect(() => {
    fetchMdxContent();
  }, [fetchMdxContent]);

  const updatePreview = async (mdxContent: string) => {
    try {
      const mdxSource = await serialize(mdxContent);
      setCompiledSource(mdxSource);
    } catch (error) {
      console.error("Error compiling MDX:", error);
      setError("Failed to compile MDX content.");
    }
  };

  const handleContentChange = async (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const newContent = e.target.value;
    setContent(newContent);
    await updatePreview(newContent);
  };

  interface Blob {
    url: string;
    pathname: string;
    downloadUrl: string;
    size: number;
    uploadedAt: string;
  }

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const path = `content/${params.slug.join("/")}`;

      // Check if the file already exists
      const checkResponse = await fetch(`/api/data?path=${path}`);
      const checkData: { blobs: Blob[] } = await checkResponse.json();

      console.log("Check data:", checkData);

      const existingFile = checkData.blobs.find((blob: Blob) =>
        blob.pathname.startsWith(path)
      );

      // Always create a new file
      const newFilePath = `${path}/page.mdx`;
      const createResponse = await fetch("/api/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          path: newFilePath,
          content: content,
        }),
      });

      if (!createResponse.ok) {
        const errorText = await createResponse.text();
        throw new Error(
          `HTTP error! status: ${createResponse.status}, message: ${errorText}`
        );
      }

      const result: Blob = await createResponse.json();
      console.log("Create result:", result);

      // If there was an existing file, delete it
      if (existingFile) {
        try {
          await fetch("/api/data", {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              url: existingFile.url,
            }),
          });
          console.log("Previous file deleted:", existingFile.url);
        } catch (deleteError) {
          console.error("Error deleting previous file:", deleteError);
          // Continue with the save process even if delete fails
        }
      }

      setSuccess("Your file has been saved successfully.");
      toast({
        title: "File saved",
        description: "Your file has been saved successfully.",
      });

      setOriginalContent(content);
      await updatePreview(content);
      await refreshSidebar();
    } catch (error) {
      console.error("Error saving content:", error);
      setError(
        `Failed to save content: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      toast({
        title: "Error",
        description: "Failed to save content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToolbarAction = (
    action:
      | "bold"
      | "italic"
      | "unordered-list"
      | "ordered-list"
      | "image"
      | "link"
  ) => {
    switch (action) {
      case "bold":
        setContent((prevContent) => `${prevContent}**bold text**`);
        break;
      case "italic":
        setContent((prevContent) => `${prevContent}*italic text*`);
        break;
      case "unordered-list":
        setContent((prevContent) => `${prevContent}\n- unordered list item`);
        break;
      case "ordered-list":
        setContent((prevContent) => `${prevContent}\n1. ordered list item`);
        break;
      case "image":
        setContent((prevContent) => `${prevContent}\n![Alt text](image-url)`);
        break;
      case "link":
        setContent((prevContent) => `${prevContent}[Link text](url)`);
        break;
    }
  };

  const isContentEdited = content !== originalContent;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            {params.slug.join(" / ")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert
              variant="default"
              className="mb-4 bg-green-50 text-green-800 border-green-300"
            >
              <CheckCircle className="h-4 w-4 text-green-400" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
          <div className="mb-4">
            <Button
              onClick={handleSave}
              disabled={isSaving || !isContentEdited}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
          <Tabs defaultValue="edit" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="edit">Edit</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            <TabsContent value="edit">
              <EditToolbar onAction={handleToolbarAction} />
              <Textarea
                value={content}
                onChange={handleContentChange}
                className="min-h-[calc(100vh-400px)] mt-2"
              />
            </TabsContent>
            <TabsContent value="preview">
              <div className="border rounded-md p-4 min-h-[calc(100vh-400px)] prose prose-invert max-w-none">
                {compiledSource && (
                  <MDXRemote
                    {...compiledSource}
                    components={{
                      MDXCarousel,
                      MDXImage,
                    }}
                  />
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
