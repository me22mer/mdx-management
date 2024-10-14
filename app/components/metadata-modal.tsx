import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Switch } from "@/app/components/ui/switch";

interface Metadata {
  type: string;
  title: string;
  description: string;
  publishedAt: string;
  tags: string[];
  published: boolean;
  readingTime: string;
}

interface MetadataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (metadata: Metadata) => void;
}

export function MetadataModal({ isOpen, onClose, onSave }: MetadataModalProps) {
  const [metadata, setMetadata] = useState<Metadata>({
    type: '',
    title: '',
    description: '',
    publishedAt: '',
    tags: [],
    published: false,
    readingTime: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'tags') {
      setMetadata(prev => ({ ...prev, [name]: value.split(',').map(tag => tag.trim()) }));
    } else {
      setMetadata(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSwitchChange = (checked: boolean) => {
    setMetadata(prev => ({ ...prev, published: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(metadata);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Insert Metadata</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Input
                id="type"
                name="type"
                value={metadata.type}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                name="title"
                value={metadata.title}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={metadata.description}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="publishedAt" className="text-right">
                Published At
              </Label>
              <Input
                id="publishedAt"
                name="publishedAt"
                type="date"
                value={metadata.publishedAt}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tags" className="text-right">
                Tags
              </Label>
              <Input
                id="tags"
                name="tags"
                value={metadata.tags.join(', ')}
                onChange={handleChange}
                placeholder="Comma-separated tags"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="readingTime" className="text-right">
                Reading Time
              </Label>
              <Input
                id="readingTime"
                name="readingTime"
                value={metadata.readingTime}
                onChange={handleChange}
                placeholder="e.g., 5 min"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="published" className="text-right">
                Published
              </Label>
              <Switch
                id="published"
                checked={metadata.published}
                onCheckedChange={handleSwitchChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save Metadata</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}