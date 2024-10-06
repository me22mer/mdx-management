"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/app/components/ui/dialog";
import { Label } from "@/app/components/ui/label";
import { useTransitionRouter } from 'next-view-transitions'
import { createNewItem } from "@/app/services/mdx-services";

type CategoryType = "blog" | "projects";

interface NewItemDialogProps {
  onRefresh: () => Promise<void>;
}

export function NewItemDialog({ onRefresh }: NewItemDialogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemType, setNewItemType] = useState<CategoryType>("blog");
  const router = useTransitionRouter();

  const handleNewItem = async () => {
    if (newItemName.trim()) {
      const success = await createNewItem(newItemType, newItemName.trim());
      if (success) {
        await onRefresh();
        router.push(`/edit/${newItemType}/${newItemName.trim()}`);
      }
      setNewItemName("");
      setIsDialogOpen(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm" className="w-full h-10">
          <Plus className="w-4 h-4 mr-1.5" /> New Post
        </Button>
      </DialogTrigger>
      <DialogContent className="text-primary">
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
          <DialogDescription>
            Enter a name for your new blog post or project.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="item-type" className="text-right">
              Type
            </Label>
            <select
              id="item-type"
              value={newItemType}
              onChange={(e) => setNewItemType(e.target.value as CategoryType)}
              className="col-span-3 p-2 border rounded-md"
            >
              <option value="blog">Blog</option>
              <option value="projects">Project</option>
            </select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="item-name" className="text-right">
              Name
            </Label>
            <Input
              id="item-name"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleNewItem}>Create Item</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}