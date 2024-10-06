"use client";

import React from "react";
import { Textarea } from "@/app/components/ui/textarea";
import { EditToolbar } from "@/app/components/edit-toolbar";

interface EditorComponentProps {
  content: string;
  onContentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onToolbarAction: (action: "bold" | "italic" | "unordered-list" | "ordered-list" | "image" | "link") => void;
}

export function EditorComponent({ content, onContentChange, onToolbarAction }: EditorComponentProps) {
  return (
    <>
      <EditToolbar onAction={onToolbarAction} />
      <Textarea
        value={content}
        onChange={onContentChange}
        className="min-h-[calc(100vh-400px)] mt-2"
      />
    </>
  );
}