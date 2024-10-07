"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { FolderPlus } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { useContentContext } from "@/app/contexts/content-context";
import { createNewItem } from "@/app/services/mdx-service";
import { useAuth } from "@/app/services/auth-service";
import { useTransitionRouter } from "next-view-transitions";

export default function HomeContent() {
  const [newItemName, setNewItemName] = useState("");
  const [newItemType, setNewItemType] = useState<"blog" | "projects">("blog");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useTransitionRouter();
  const { setShouldRefresh } = useContentContext();
  const { isAdmin } = useAuth();

  const handleCreateNewItem = async () => {
    if (!newItemName.trim()) return;

    const success = await createNewItem(newItemType, newItemName.trim(), isAdmin);
    if (success) {
      setShouldRefresh(true);
      router.push(`/edit/${newItemType}/${newItemName.trim()}`);
    }

    setIsDialogOpen(false);
    setNewItemName("");
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6">Welcome to MDX Manager</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>
              Manage and edit your MDX content with ease
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Select a page from the sidebar to edit or preview MDX content. You
              can create new blog posts or projects, edit existing ones, and
              manage your content efficiently.
            </p>

            <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <FolderPlus className="mr-2 h-4 w-4" />
                    New Post
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
                          setNewItemType(e.target.value as "blog" | "projects")
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
                    <Button onClick={handleCreateNewItem}>Create Item</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}