"use client";

import { useState, useEffect } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Plus,
  File,
  Trash2,
  FolderOpen,
  Folder,
  AlertTriangle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useContentContext } from "../contexts/content-context";
import Link from "next/link";

interface BlobData {
  url: string;
  pathname: string;
}

interface FolderStructure {
  blog: BlobData[];
  projects: BlobData[];
}

type CategoryType = "blog" | "projects";

export default function Sidebar() {
  const [folderStructure, setFolderStructure] = useState<FolderStructure>({
    blog: [],
    projects: [],
  });
  const [expandedFolders, setExpandedFolders] = useState<{
    [key: string]: boolean;
  }>({
    blog: true,
    projects: true,
  });
  const [newItemName, setNewItemName] = useState("");
  const [newItemType, setNewItemType] = useState<CategoryType>("blog");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<{
    url: string;
    pathname: string;
  } | null>(null);
  const router = useRouter();
  const { shouldRefresh, setShouldRefresh } = useContentContext();

  useEffect(() => {
    fetchBlobData();
  }, []);

  useEffect(() => {
    if (shouldRefresh) {
      fetchBlobData();
      setShouldRefresh(false);
    }
  }, [shouldRefresh, setShouldRefresh]);

  const fetchBlobData = async () => {
    try {
      const response = await fetch("/api/data?path=content/");
      const data = await response.json();
      const structure: FolderStructure = {
        blog: [],
        projects: [],
      };

      data.blobs.forEach((blob: BlobData) => {
        const [, category] = blob.pathname.split("/");
        if (category === "blog" || category === "projects") {
          structure[category].push(blob);
        }
      });

      setFolderStructure(structure);
    } catch (error) {
      console.error("Error fetching blob data:", error);
    }
  };

  const toggleFolder = (folderName: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderName]: !prev[folderName],
    }));
  };

  const openDeleteDialog = (url: string, pathname: string) => {
    setFileToDelete({ url, pathname });
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!fileToDelete) return;

    const { url, pathname } = fileToDelete;

    try {
      const response = await fetch("/api/data", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: url,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await response.json();
      toast({
        title: "File deleted",
        description: "The file has been deleted successfully.",
      });
      // Remove the deleted file from the folder structure
      setFolderStructure((prevStructure) => {
        const [, category] = pathname.split("/") as [string, CategoryType];
        return {
          ...prevStructure,
          [category]: prevStructure[category].filter(
            (blob) => blob.url !== url
          ),
        };
      });
    } catch (error) {
      console.error("Error deleting content:", error);
      toast({
        title: "Error",
        description: "Failed to delete content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setFileToDelete(null);
    }
  };

  const createNewItem = async (category: CategoryType, name: string) => {
    try {
      const response = await fetch("/api/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          path: `content/${category}/${name}/page.mdx`,
          content: `# New ${category}: ${name}\n\nWelcome to your new ${category}!`,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      toast({
        title: `New ${category} created`,
        description: `${name} has been created successfully.`,
      });

      // Update the folder structure
      setFolderStructure((prevStructure) => ({
        ...prevStructure,
        [category]: [
          ...prevStructure[category],
          { url: result.url, pathname: `content/${category}/${name}/page.mdx` },
        ],
      }));

      // Navigate to the new file
      router.push(`/edit/${category}/${name}`);
    } catch (error) {
      console.error(`Error creating new ${category}:`, error);
      toast({
        title: "Error",
        description: `Failed to create new ${category}. Please try again.`,
        variant: "destructive",
      });
    }
  };

  const handleNewItem = () => {
    if (newItemName.trim()) {
      createNewItem(newItemType, newItemName.trim());
      setNewItemName("");
      setIsDialogOpen(false);
    }
  };

  return (
    <aside className="w-80 border-r border-border bg-background flex flex-col h-screen">
      <div className="p-4 border-b border-border">
        <h2 className="text-2xl font-bold text-primary">Content Manager</h2>
      </div>
      <div className="p-4">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="default" size="sm" className="w-full">
              <Plus className="w-4 h-4 mr-2" /> New Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Item</DialogTitle>
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
                  onChange={(e) =>
                    setNewItemType(e.target.value as CategoryType)
                  }
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
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-destructive mr-2" />
              Confirm Deletion
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Are you sure you want to delete this file? This action cannot be
            undone.
          </DialogDescription>
          <DialogFooter className="sm:justify-start">
            <Button type="button" variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ScrollArea className="flex-grow">
        <div className="p-4">
          {(["blog", "projects"] as const).map((category) => (
            <div key={category} className="mb-6">
              <Button
                variant="ghost"
                className="text-lg font-semibold w-full justify-start px-2 py-1 hover:bg-accent hover:text-accent-foreground"
                onClick={() => toggleFolder(category)}
              >
                {expandedFolders[category] ? (
                  <FolderOpen className="w-5 h-5 mr-2" />
                ) : (
                  <Folder className="w-5 h-5 mr-2" />
                )}
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Button>
              {expandedFolders[category] && (
                <div className="ml-4 mt-2 space-y-1">
                  {folderStructure[category].map((file) => (
                    <div
                      key={file.url}
                      className="flex items-center justify-between py-1 px-2 rounded-md hover:bg-accent group"
                    >
                      <Link
                        href={`/edit/${file.pathname
                          .replace("content/", "")
                          .replace("/page.mdx", "")}`}
                        className="flex items-center flex-grow text-sm"
                      >
                        <File className="w-4 h-4 mr-2 text-muted-foreground" />
                        <span className="truncate">
                          {file.pathname.split("/")[2]}
                        </span>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          openDeleteDialog(file.url, file.pathname)
                        }
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </aside>
  );
}
