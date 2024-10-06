"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/app/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import type { MDXRemoteSerializeResult } from "next-mdx-remote";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { Loader2, AlertTriangle, CheckCircle } from "lucide-react";
import { useContentContext } from "@/app/contexts/content-context";
import { BlobData, saveContent, updatePreview } from "@/app/services/mdx-service";
import { useTransitionRouter } from 'next-view-transitions'
import { notFound } from "next/navigation";
import { EditorComponent } from "@/app/components/editor";
import { PreviewComponent } from "@/app/components/preview";

interface EditPageProps {
  params: { slug: string[] };
}

export default function EditPage({ params }: EditPageProps) {
  const [content, setContent] = useState("");
  const [originalContent, setOriginalContent] = useState("");
  const [compiledSource, setCompiledSource] = useState<MDXRemoteSerializeResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { shouldRefresh, setShouldRefresh, deletedItem, setDeletedItem } = useContentContext();
  const router = useTransitionRouter()

  const fetchMdxContent = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/data?path=content/${params.slug.join("/")}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data: { blobs: BlobData[] } = await response.json();
      
      if (data.blobs && data.blobs.length > 0) {
        const exactMatch = data.blobs.find((blob: BlobData) => blob.pathname === `content/${params.slug.join("/")}/page.mdx`);        
        if (exactMatch) {
          const mdxContent = await fetch(exactMatch.url).then((res) => res.text());
          setContent(mdxContent);
          setOriginalContent(mdxContent);
          const compiled = await updatePreview(mdxContent);
          if (compiled) setCompiledSource(compiled);
        } else {
          router.push(notFound());
        }
      } else {
        router.push(notFound());
      }
    } catch (error) {
      console.error("Error fetching MDX content:", error);
      setError(`Failed to load content: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  }, [params.slug, router]);

  useEffect(() => {
    fetchMdxContent();
  }, [fetchMdxContent]);

  useEffect(() => {
    if (deletedItem && deletedItem.startsWith(`content/${params.slug.join("/")}`)) {
      router.push('/');
      setDeletedItem(null);
    }
  }, [deletedItem, params.slug, router, setDeletedItem]);

  useEffect(() => {
    if (shouldRefresh) {
      fetchMdxContent();
      setShouldRefresh(false);
    }
  }, [shouldRefresh, fetchMdxContent, setShouldRefresh]);

  const handleContentChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    const compiled = await updatePreview(newContent);
    if (compiled) setCompiledSource(compiled);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(null);
    const path = `content/${params.slug.join("/")}`;
    const success = await saveContent(path, content);
    if (success) {
      setSuccess("Your file has been saved successfully.");
      setOriginalContent(content);
      const compiled = await updatePreview(content);
      if (compiled) setCompiledSource(compiled);
    } else {
      setError("Failed to save content. Please try again.");
    }
    setIsSaving(false);
  };

  const handleToolbarAction = (
    action: "bold" | "italic" | "unordered-list" | "ordered-list" | "image" | "link"
  ) => {
    const actions = {
      bold: "**bold text**",
      italic: "*italic text*",
      "unordered-list": "\n- unordered list item",
      "ordered-list": "\n1. ordered list item",
      image: "\n![Alt text](image-url)",
      link: "[Link text](url)",
    };
    setContent((prevContent) => `${prevContent}${actions[action]}`);
  };

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
          <CardTitle className="text-3xl font-bold">{params.slug.join(" / ")}</CardTitle>
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
            <Alert variant="default" className="mb-4 bg-green-50 text-green-800 border-green-300">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
          <div className="mb-4">
            <Button
              onClick={handleSave}
              disabled={isSaving || content === originalContent}
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
            <TabsList className="grid w-max grid-cols-2">
              <TabsTrigger value="edit">Edit</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            <TabsContent value="edit">
              <EditorComponent
                content={content}
                onContentChange={handleContentChange}
                onToolbarAction={handleToolbarAction}
              />
            </TabsContent>
            <TabsContent value="preview">
              <PreviewComponent compiledSource={compiledSource} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}