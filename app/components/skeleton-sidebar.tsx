import { Skeleton } from "@/app/components/ui/skeleton";

export function SkeletonSidebar() {
  return (
    <div className="w-80 border-r border-border bg-background flex flex-col h-screen">
      <div className="p-4 border-b border-border">
        <Skeleton className="h-8 w-48" />
      </div>
      <div className="p-4">
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="flex-grow p-4">
        {[...Array(2)].map((_, categoryIndex) => (
          <div key={categoryIndex} className="mb-6">
            <Skeleton className="h-8 w-32 mb-2" />
            {[...Array(3)].map((_, itemIndex) => (
              <div key={itemIndex} className="flex items-center justify-between py-1 px-2 mb-1">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-6 w-6" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}