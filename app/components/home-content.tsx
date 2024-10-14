"use client";

import React, { useState, lazy, Suspense } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { FolderPlus, FilePlus, Loader2 } from "lucide-react";
import { useContentContext } from "@/app/contexts/content-context";
import { useAuth } from "@/app/services/auth-service";
import { ContentManagementInfo } from "@/app/components/content-management-info";

const NewItemDialog = lazy(() => import("@/app/components/new-item-dialog"));

export default function HomeContent() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isNewCategory, setIsNewCategory] = useState(false);
  const { setShouldRefresh } = useContentContext();
  const { isAdmin } = useAuth();

  const handleRefresh = async () => {
    setShouldRefresh(true);
  };

  const openNewItemDialog = (newCategory: boolean) => {
    setIsNewCategory(newCategory);
    setIsDialogOpen(true);
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
              <Button onClick={() => openNewItemDialog(false)}>
                <FilePlus className="mr-2 h-4 w-4" />
                New Post
              </Button>
              <Button onClick={() => openNewItemDialog(true)} variant="outline">
                <FolderPlus className="mr-2 h-4 w-4" />
                New Category
              </Button>
            </div>
          </CardContent>
        </Card>
        <ContentManagementInfo />
      </div>
      <Suspense fallback={<div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin" /></div>}>
        {isDialogOpen && (
          <NewItemDialog
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            onRefresh={handleRefresh}
            isAdmin={isAdmin}
            isNewCategory={isNewCategory}
          />
        )}
      </Suspense>
    </div>
  );
}