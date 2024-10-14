"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { Button } from "@/app/components/ui/button";
import { File, Trash2, FolderOpen, Folder, Plus } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";
import { useContentContext } from "@/app/contexts/content-context";
import { BlobData, fetchBlobData, CategoryType } from "@/app/services/mdx-service";
import { usePathname } from "next/navigation";
import { useTransitionRouter } from "next-view-transitions";
import { DeleteItemDialog } from "./delete-item-dialog";
import { useAuth } from "@/app/services/auth-service";
import { LogoutButton } from "./logout-button";
import NewItemDialog from "./new-item-dialog";

interface FolderStructure {
  [key: string]: BlobData[];
}

export function Sidebar() {
  const [folderStructure, setFolderStructure] = useState<FolderStructure>({});
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [newItemDialogOpen, setNewItemDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<BlobData | null>(null);
  const [newItemCategory, setNewItemCategory] = useState<CategoryType>("blog");
  const [isNewCategory, setIsNewCategory] = useState(false);
  const { shouldRefresh, setShouldRefresh, setDeletedItem } = useContentContext();
  const pathname = usePathname();
  const router = useTransitionRouter();
  const { isAuthenticated, isAdmin } = useAuth();

  const isEditPage = pathname.startsWith("/edit");

  const refreshData = useCallback(async () => {
    const data = await fetchBlobData(isAdmin);
    if (data) {
      setFolderStructure(data);
      setExpandedFolders(Object.keys(data).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
    }
  }, [isAdmin]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  useEffect(() => {
    if (shouldRefresh) {
      refreshData();
      setShouldRefresh(false);
    }
  }, [shouldRefresh, refreshData, setShouldRefresh]);

  const toggleFolder = useCallback((folderName: string) => {
    setExpandedFolders(prev => ({ ...prev, [folderName]: !prev[folderName] }));
  }, []);

  const openDeleteDialog = useCallback((file: BlobData) => {
    setFileToDelete(file);
    setDeleteDialogOpen(true);
  }, []);

  const openNewItemDialog = useCallback((category: CategoryType) => {
    setNewItemCategory(category);
    setIsNewCategory(false);
    setNewItemDialogOpen(true);
  }, []);

  const openNewCategoryDialog = useCallback(() => {
    setNewItemCategory("" as CategoryType);
    setIsNewCategory(true);
    setNewItemDialogOpen(true);
  }, []);

  const renderFileItem = useCallback(
    (file: BlobData) => (
      <div
        key={file.url}
        className="flex items-center justify-between py-1 px-2 rounded-md hover:bg-accent group"
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center flex-grow text-sm overflow-hidden justify-start p-0 h-auto hover:bg-accent hover:text-foreground"
                onClick={() =>
                  router.push(
                    `/edit/${file.pathname
                      .replace("content/", "")
                      .replace("/page.mdx", "")}`
                  )
                }
              >
                <File className="w-4 h-4 mr-2 text-muted-foreground flex-shrink-0" />
                <span className="truncate">{file.pathname.split("/")[2]}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{file.pathname.split("/")[2]}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => openDeleteDialog(file)}
          className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 hover:bg-zinc-300"
        >
          <Trash2 className="w-4 h-4 text-destructive" />
        </Button>
      </div>
    ),
    [openDeleteDialog, router]
  );

  const renderCategory = useCallback(
    (category: string) => (
      <div key={category} className="mb-6">
        <div className="flex items-center justify-between group">
          <Button
            variant="ghost"
            className="text-lg font-semibold w-full justify-start px-2 py-1 hover:bg-accent hover:text-foreground"
            onClick={() => toggleFolder(category)}
          >
            {expandedFolders[category] ? (
              <FolderOpen className="w-5 h-5 mr-2" />
            ) : (
              <Folder className="w-5 h-5 mr-2" />
            )}
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => openNewItemDialog(category)}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        {expandedFolders[category] && (
          <div className="ml-4 mt-2 space-y-1">
            {folderStructure[category]?.map(renderFileItem)}
          </div>
        )}
      </div>
    ),
    [expandedFolders, folderStructure, renderFileItem, toggleFolder, openNewItemDialog]
  );

  const categories = useMemo(() => Object.keys(folderStructure), [folderStructure]);

  return (
    <aside className="w-80 border-r border-border bg-background flex flex-col h-screen">
      <div className="p-4 border-b border-border">
        <h2 className="text-2xl font-bold text-primary">Content Manager</h2>
      </div>
      {isEditPage && (
        <div className="p-4">
          <Button onClick={openNewCategoryDialog} className="w-full">
            New Category
          </Button>
        </div>
      )}
      <NewItemDialog
        isOpen={newItemDialogOpen}
        onClose={() => setNewItemDialogOpen(false)}
        isAdmin={isAdmin}
        onRefresh={refreshData}
        initialCategory={newItemCategory}
        isNewCategory={isNewCategory}
      />

      <DeleteItemDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        fileToDelete={fileToDelete}
        onDelete={refreshData}
        setDeletedItem={setDeletedItem}
        isAdmin={isAdmin}
      />

      <ScrollArea className="flex-grow">
        <div className="p-4">{categories.map(renderCategory)}</div>
      </ScrollArea>

      {isAuthenticated && (
        <div className="p-4 border-t border-border">
          <LogoutButton />
        </div>
      )}
    </aside>
  );
}