"use client";

import React, { useState } from "react";
import { Button } from "@/app/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";
import { Image, FileImage, Type } from "lucide-react";
import { MetadataModal } from "./metadata-modal";

type MDXComponentType = "MDXImage" | "MDXCarousel" | "MDXMetadata";

interface Metadata {
  type: string;
  title: string;
  description: string;
  publishedAt: string;
  tags: string[];
  published: boolean;
  readingTime: string;
}

interface MDXToolbarProps {
  onInsert: (componentType: MDXComponentType, content?: string) => void;
}

export function MDXToolbar({ onInsert }: MDXToolbarProps) {
  const [isMetadataModalOpen, setIsMetadataModalOpen] = useState(false);

  const components: Array<{ type: MDXComponentType; icon: React.ReactNode; label: string }> = [
    // eslint-disable-next-line jsx-a11y/alt-text
    { type: "MDXImage", icon: <Image className="w-4 h-4" />, label: "Insert Image" },
    { type: "MDXCarousel", icon: <FileImage className="w-4 h-4" />, label: "Insert Carousel" },
    { type: "MDXMetadata", icon: <Type className="w-4 h-4" />, label: "Insert Metadata" },
  ];

  const handleMetadataSave = (metadata: Metadata) => {
    const metadataString = `
<MDXMetadata 
  type="${metadata.type}"
  title="${metadata.title}"
  description="${metadata.description}"
  publishedAt="${metadata.publishedAt}"
  readingTime="${metadata.readingTime}"
  published={${metadata.published}}
  tags={${JSON.stringify(metadata.tags)}}
/>
`;
    onInsert("MDXMetadata", metadataString);
  };

  return (
    <TooltipProvider>
      <div className="flex items-center space-x-2 mb-4 p-2 bg-secondary rounded-md">
        {components.map(({ type, icon, label }) => (
          <Tooltip key={type}>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => type === "MDXMetadata" ? setIsMetadataModalOpen(true) : onInsert(type)}
              >
                {icon}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{label}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
      <MetadataModal 
        isOpen={isMetadataModalOpen}
        onClose={() => setIsMetadataModalOpen(false)}
        onSave={handleMetadataSave}
      />
    </TooltipProvider>
  );
}