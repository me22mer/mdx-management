"use client";

import { Button } from "@/app/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";
import { BlobData } from "@/app/services/mdx-services";
import { toast } from "@/hooks/use-toast";

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  fileToDelete: BlobData | null;
  onDelete: () => Promise<void>;
  setDeletedItem: (path: string) => void;
}

export function DeleteItemDialog({
  isOpen,
  onClose,
  fileToDelete,
  onDelete,
  setDeletedItem
}: DeleteConfirmationDialogProps) {
  const handleDelete = async () => {
    if (!fileToDelete) return;

    try {
      const response = await fetch("/api/data", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: fileToDelete.url }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      await response.json();
      toast({
        title: "File deleted",
        description: "The file has been deleted successfully.",
      });
      setDeletedItem(fileToDelete.pathname);
      await onDelete();
    } catch (error) {
      console.error("Error deleting content:", error);
      toast({
        title: "Error",
        description: "Failed to delete content. Please try again.",
        variant: "destructive",
      });
    } finally {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-destructive mr-2" />
            Confirm Deletion
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Are you sure you want to delete this file? This action cannot be undone.
        </DialogDescription>
        <DialogFooter className="sm:justify-start">
          <Button type="button" variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}