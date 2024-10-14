"use client";

import React from "react";
import { Textarea } from "@/app/components/ui/textarea";
import { EditToolbar } from "@/app/components/edit-toolbar";
import { MDXToolbar } from "@/app/components/mdx-toolbar";
import { Card, CardContent } from "@/app/components/ui/card";
import { ScrollArea } from "@/app/components/ui/scroll-area";

type MDXComponentType = "MDXImage" | "MDXCarousel" | "MDXMetadata";

interface EditorComponentProps {
  content: string;
  onContentChange: (newContent: string) => void;
  onToolbarAction: (action: "bold" | "italic" | "unordered-list" | "ordered-list" | "image" | "link") => void;
}

export function EditorComponent({ content, onContentChange, onToolbarAction }: EditorComponentProps) {
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onContentChange(e.target.value);
  };

  const handleMDXInsert = (componentType: MDXComponentType, insertContent?: string) => {
    let newContent = "";
    switch (componentType) {
      case "MDXImage":
        newContent = '<MDXImage src="/path/to/image.jpg" alt="Description" caption="Optional caption" />';
        break;
      case "MDXCarousel":
        newContent = '<MDXCarousel images={["/path/to/image1.jpg", "/path/to/image2.jpg"]} caption="Optional caption" />';
        break;
      case "MDXMetadata":
        newContent = insertContent || "";
        break;
    }
    onContentChange(content + "\n\n" + newContent + "\n");
  };

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mb-4">
          <div className="flex-1">
            <h3 className="text-sm font-medium mb-2">Text Formatting</h3>
            <EditToolbar onAction={onToolbarAction} />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium mb-2">MDX Components</h3>
            <MDXToolbar onInsert={handleMDXInsert} />
          </div>
        </div>
        <ScrollArea className="h-[calc(100vh-300px)] border rounded-md">
          <Textarea
            value={content}
            onChange={handleContentChange}
            className="min-h-full w-full resize-none border-none focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="Start writing your content here..."
          />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}