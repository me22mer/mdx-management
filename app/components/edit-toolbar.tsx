/* eslint-disable jsx-a11y/alt-text */

"use client";

import React from "react";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Image,
  Link as LinkIcon,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";

type ToolbarAction = 'bold' | 'italic' | 'unordered-list' | 'ordered-list' | 'image' | 'link';

interface EditToolbarProps {
  onAction: (action: ToolbarAction) => void;
}

interface ToolbarButton {
  action: ToolbarAction;
  icon: React.ReactNode;
  label: string;
}

export function EditToolbar({ onAction }: EditToolbarProps) {
  const buttons: ToolbarButton[] = [
    { action: 'bold', icon: <Bold className="w-4 h-4" />, label: 'Bold' },
    { action: 'italic', icon: <Italic className="w-4 h-4" />, label: 'Italic' },
    { action: 'unordered-list', icon: <List className="w-4 h-4" />, label: 'Unordered List' },
    { action: 'ordered-list', icon: <ListOrdered className="w-4 h-4" />, label: 'Ordered List' },
    { action: 'image', icon: <Image className="w-4 h-4" />, label: 'Insert Image' },
    { action: 'link', icon: <LinkIcon className="w-4 h-4" />, label: 'Insert Link' },
  ];

  return (
    <TooltipProvider>
      <div className="flex items-center space-x-2 mb-4 p-2 bg-secondary rounded-md">
        {buttons.map((button) => (
          <Tooltip key={button.action}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onAction(button.action)}
                aria-label={button.label}
              >
                {button.icon}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{button.label}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}