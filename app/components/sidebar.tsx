"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { Button } from "@/app/components/ui/button";
import { File, Trash2, FolderOpen, Folder } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";
import { useContentContext } from "@/app/contexts/content-context";
import { BlobData, fetchBlobData } from "@/app/services/mdx-services";
import { usePathname } from "next/navigation";
import { useTransitionRouter } from "next-view-transitions";
import { NewItemDialog } from "./new-item-dialog";
import { DeleteItemDialog } from "./delete-item-dialog";

type CategoryType = "blog" | "projects";

interface FolderStructure {
  blog: BlobData[];
  projects: BlobData[];
}

export function Sidebar() {
  const [folderStructure, setFolderStructure] = useState<FolderStructure>({
    blog: [],
    projects: [],
  });
  const [expandedFolders, setExpandedFolders] = useState<
    Record<CategoryType, boolean>
  >({ blog: true, projects: true });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<BlobData | null>(null);
  const { shouldRefresh, setShouldRefresh, setDeletedItem } =
    useContentContext();
  const pathname = usePathname();
  const router = useTransitionRouter();

  const isEditPage = pathname.startsWith("/edit");

  const refreshData = useCallback(async () => {
    const data = await fetchBlobData();
    if (data) setFolderStructure(data);
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  useEffect(() => {
    if (shouldRefresh) {
      refreshData();
      setShouldRefresh(false);
    }
  }, [shouldRefresh, refreshData, setShouldRefresh]);

  const toggleFolder = useCallback((folderName: CategoryType) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderName]: !prev[folderName],
    }));
  }, []);

  const openDeleteDialog = useCallback((file: BlobData) => {
    setFileToDelete(file);
    setDeleteDialogOpen(true);
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
                className="flex items-center flex-grow text-sm overflow-hidden justify-start p-0 h-auto hover:bg-accent "
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
    (category: CategoryType) => (
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
            {folderStructure[category].map(renderFileItem)}
          </div>
        )}
      </div>
    ),
    [expandedFolders, folderStructure, renderFileItem, toggleFolder]
  );

  const categories = useMemo(() => ["blog", "projects"] as const, []);

  return (
    <aside className="w-80 border-r border-border bg-background flex flex-col h-screen">
      <div className="p-4 border-b border-border">
        <h2 className="text-2xl font-bold text-primary">Content Manager</h2>
      </div>
      {isEditPage && (
        <div className="p-4">
          <NewItemDialog onRefresh={refreshData} />
        </div>
      )}

      <DeleteItemDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        fileToDelete={fileToDelete}
        onDelete={refreshData}
        setDeletedItem={setDeletedItem}
      />

      <ScrollArea className="flex-grow">
        <div className="p-4">{categories.map(renderCategory)}</div>
      </ScrollArea>
    </aside>
  );
}
