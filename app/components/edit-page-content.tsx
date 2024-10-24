"use client";

import React, { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { Button } from "@/app/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import type { MDXRemoteSerializeResult } from "next-mdx-remote";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { Loader2, AlertTriangle, CheckCircle, Download } from "lucide-react";
import { useContentContext } from "@/app/contexts/content-context";
import { saveContent, updatePreview, fetchBlobData, CategoryType } from "@/app/services/mdx-service";
import { useTransitionRouter } from 'next-view-transitions'
import { notFound } from "next/navigation";
import { useAuth } from "@/app/services/auth-service";

const EditorComponent = lazy(() => import("@/app/components/editor").then(mod => ({ default: mod.EditorComponent })));
const PreviewComponent = lazy(() => import("@/app/components/preview").then(mod => ({ default: mod.PreviewComponent })));

interface EditPageContentProps {
  params: { slug: string[] };
}

function convertMDXMetadataToFrontmatter(content: string): string {
  const mdxMetadataRegex = /<MDXMetadata\s+([\s\S]*?)\s*\/>/g;
  let convertedContent = content;
  // eslint-disable-next-line prefer-const
  let frontmatter: Record<string, unknown> = {};
  let match: RegExpExecArray | null;

  while ((match = mdxMetadataRegex.exec(content)) !== null) {
    const metadataContent = match[1];
    const keyValueRegex = /(\w+)=(?:{([^}]*)}|"([^"]*)")/g;
    let keyValueMatch: RegExpExecArray | null;

    while ((keyValueMatch = keyValueRegex.exec(metadataContent)) !== null) {
      const [, key, valueInBraces, valueInQuotes] = keyValueMatch;
      const value = valueInBraces || valueInQuotes;
      
      try {
        frontmatter[key] = JSON.parse(value);
      } catch {
        frontmatter[key] = value.replace(/^["']|["']$/g, ''); 
      }
    }

    convertedContent = convertedContent.replace(match[0], '');
  }

  const yamlFrontmatter = Object.entries(frontmatter)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return `${key}:\n  - ${value.join('\n  - ')}`;
      }
      if (typeof value === 'boolean') {
        return `${key}: ${value}`;
      }
      return `${key}: "${value}"`;
    })
    .join('\n');

  return `---\n${yamlFrontmatter}\n---\n\n${convertedContent.trim()}`;
}

export default function EditPageContent({ params }: EditPageContentProps) {
  const [content, setContent] = useState("");
  const [originalContent, setOriginalContent] = useState("");
  const [compiledSource, setCompiledSource] = useState<MDXRemoteSerializeResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [title, setTitle] = useState("");
  const { shouldRefresh, setShouldRefresh, deletedItem, setDeletedItem } = useContentContext();
  const router = useTransitionRouter();
  const { isAdmin } = useAuth();

  const fetchMdxContent = useCallback(async () => {
    setError(null);
    try {
      const data = await fetchBlobData(isAdmin);
      if (data) {
        const category = params.slug[0] as CategoryType;
        const fileName = params.slug[1];
        const file = data[category]?.find((item) => item.pathname.includes(fileName));
        
        if (file) {
          let mdxContent;
          if (isAdmin) {
            const response = await fetch(file.url);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            mdxContent = await response.text();
          } else {
            const localStorage = window.localStorage;
            mdxContent = localStorage.getItem(`content/${category}/${fileName}/page.mdx`) || "";
          }
          setContent(mdxContent);
          setOriginalContent(mdxContent);
          setTitle(`${category} / ${fileName}`);
          if (activeTab === "preview") {
            const compiled = await updatePreview(mdxContent);
            if (compiled) setCompiledSource(compiled);
          }
        } else {
          throw new Error("File not found");
        }
      } else {
        throw new Error("No data returned from fetchBlobData");
      }
    } catch (error) {
      console.error("Error fetching MDX content:", error);
      setError(`Failed to load content: ${error instanceof Error ? error.message : "Unknown error"}`);
      if (error instanceof Error && error.message === "File not found") {
        router.push(notFound());
      }
    }
  }, [params.slug, router, isAdmin, activeTab]);

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

  const handleContentChange = useCallback(async (newContent: string) => {
    setContent(newContent);
    if (activeTab === "preview") {
      const compiled = await updatePreview(newContent);
      if (compiled) setCompiledSource(compiled);
    }
  }, [activeTab]);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(null);
    const path = `content/${params.slug[0]}/${params.slug[1]}`;
    const success = await saveContent(path, content, isAdmin);
    if (success) {
      setSuccess("Your file has been saved successfully.");
      setOriginalContent(content);
      if (activeTab === "preview") {
        const compiled = await updatePreview(content);
        if (compiled) setCompiledSource(compiled);
      }
    } else {
      setError("Failed to save content. Please try again.");
    }
    setIsSaving(false);
  }, [content, params.slug, isAdmin, activeTab]);

  const handleToolbarAction = useCallback((
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
  }, []);

  const handleTabChange = useCallback(async (tab: "edit" | "preview") => {
    setActiveTab(tab);
    if (tab === "preview" && !compiledSource) {
      const compiled = await updatePreview(content);
      if (compiled) setCompiledSource(compiled);
    }
  }, [content, compiledSource]);

  const handleDownload = useCallback(() => {
    const convertedContent = convertMDXMetadataToFrontmatter(content);
    const filename = `${params.slug.join("-")}.mdx`;
    const blob = new Blob([convertedContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [content, params.slug]);

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{title}</CardTitle>
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
          <div className="mb-4 flex justify-between">
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
            <Button
              onClick={handleDownload}
              variant="outline"
              className="ml-2"
            >
              <Download className="mr-2 h-4 w-4" />
              Download MDX
            </Button>
          </div>
          <Tabs value={activeTab} onValueChange={handleTabChange as (value: string) => void} className="w-full">
            <TabsList className="grid w-max grid-cols-2">
              <TabsTrigger value="edit">Edit</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            <TabsContent value="edit">
              <Suspense fallback={<div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin" /></div>}>
                <EditorComponent
                  content={content}
                  onContentChange={handleContentChange}
                  onToolbarAction={handleToolbarAction}
                />
              </Suspense>
            </TabsContent>
            <TabsContent value="preview">
              <Suspense fallback={<div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin" /></div>}>
                <PreviewComponent compiledSource={compiledSource} />
              </Suspense>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}