"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Button } from "@/app/components/ui/button";
import { createNewItem, CategoryType } from "@/app/services/mdx-service";
import { useTransitionRouter } from "next-view-transitions";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";

interface NewItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => Promise<void>;
  isAdmin: boolean;
  initialCategory?: CategoryType;
  isNewCategory: boolean;
}

export default function NewItemDialog({
  isOpen,
  onClose,
  onRefresh,
  isAdmin,
  initialCategory = "blog",
  isNewCategory,
}: NewItemDialogProps) {
  const [newItemName, setNewItemName] = useState("");
  const [newItemType, setNewItemType] = useState<CategoryType>(initialCategory);
  const [newTypeName, setNewTypeName] = useState("");
  const router = useTransitionRouter();

  useEffect(() => {
    if (isOpen) {
      setNewItemType(initialCategory);
      setNewTypeName(initialCategory);
      setNewItemName("");
    }
  }, [isOpen, initialCategory]);

  const handleCreateNewItem = async () => {
    if (!newItemName.trim()) return;

    const itemType: CategoryType = isNewCategory ? newTypeName.trim().toLowerCase() : newItemType;
    if (!itemType) return;

    const success = await createNewItem(
      itemType,
      newItemName.trim(),
      isAdmin
    );
    if (success) {
      await onRefresh();
      router.push(`/edit/${itemType}/${newItemName.trim()}`);
    }

    onClose();
    setNewItemName("");
    setNewTypeName("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isNewCategory ? "Create New Category" : "Create New Item"}</DialogTitle>
          <DialogDescription>
            {isNewCategory
              ? "Enter a name for your new category and the first item in it."
              : "Enter a name for your new content item."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {isNewCategory ? (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-type-name" className="text-right">
                Category Name
              </Label>
              <Input
                id="new-type-name"
                value={newTypeName}
                onChange={(e) => setNewTypeName(e.target.value)}
                className="col-span-3"
                placeholder="Enter new category name"
              />
            </div>
          ) : (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="item-type" className="text-right">
                Type
              </Label>
              <Input
                id="item-type"
                value={newItemType}
                readOnly
                className="col-span-3"
              />
            </div>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="item-name" className="text-right">
              {isNewCategory ? "First Item Name" : "Item Name"}
            </Label>
            <Input
              id="item-name"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              className="col-span-3"
              placeholder="Enter item name"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleCreateNewItem} disabled={!newItemName.trim() || (isNewCategory && !newTypeName.trim())}>
            Create {isNewCategory ? "Category" : "Item"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}