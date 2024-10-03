'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronRight, ChevronDown, Folder, FileText } from 'lucide-react'
import { ScrollArea } from './ui/scroll-area'
import { Skeleton } from './ui/skeleton'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible'

interface GitHubContent {
  name: string
  type: 'file' | 'dir'
  path: string
}

interface FolderStructure {
  [key: string]: {
    [key: string]: string[]
  }
}

export default function Sidebar() {
  const [folderStructure, setFolderStructure] = useState<FolderStructure>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openFolders, setOpenFolders] = useState<string[]>([])

  useEffect(() => {
    setIsLoading(true)
    fetch('/api/github?path=app/content')
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch content')
        }
        return res.json()
      })
      .then((data: GitHubContent[]) => {
        const structure: FolderStructure = {}
        data.forEach(item => {
          if (item.type === 'dir') {
            structure[item.name] = {}
            fetch(`/api/github?path=app/content/${item.name}`)
              .then(res => res.json())
              .then((subData: GitHubContent[]) => {
                subData.forEach(subItem => {
                  if (subItem.type === 'dir') {
                    if (!structure[item.name][subItem.name]) {
                      structure[item.name][subItem.name] = []
                    }
                    fetch(`/api/github?path=app/content/${item.name}/${subItem.name}`)
                      .then(res => res.json())
                      .then((fileData: GitHubContent[]) => {
                        structure[item.name][subItem.name] = fileData
                          .filter(file => file.name === 'page.mdx')
                          .map(file => file.path)
                        setFolderStructure({...structure})
                      })
                  }
                })
              })
          }
        })
        setFolderStructure(structure)
        setIsLoading(false)
      })
      .catch(error => {
        console.error('Error fetching folders:', error)
        setError('Failed to load folders. Please try again later.')
        setIsLoading(false)
      })
  }, [])

  const toggleFolder = (folder: string) => {
    setOpenFolders(prev => 
      prev.includes(folder) 
        ? prev.filter(f => f !== folder)
        : [...prev, folder]
    )
  }

  return (
    <aside className="w-64 border-r border-border bg-background">
      <div className="p-4 border-b border-border">
        <h2 className="text-xl font-bold">Pages</h2>
      </div>
      <ScrollArea className="h-[calc(100vh-5rem)]">
        <div className="p-4">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-[80%]" />
              <Skeleton className="h-4 w-[70%]" />
              <Skeleton className="h-4 w-[60%]" />
            </div>
          ) : error ? (
            <p className="text-destructive">{error}</p>
          ) : Object.entries(folderStructure).length === 0 ? (
            <p className="text-muted-foreground">No content folders found.</p>
          ) : (
            <div className="space-y-2">
              {Object.entries(folderStructure).map(([topFolder, subFolders]) => (
                <Collapsible key={topFolder} open={openFolders.includes(topFolder)}>
                  <CollapsibleTrigger 
                    className="flex items-center w-full text-left py-2 hover:bg-accent rounded-md transition-colors"
                    onClick={() => toggleFolder(topFolder)}
                  >
                    {openFolders.includes(topFolder) ? <ChevronDown className="w-4 h-4 mr-2" /> : <ChevronRight className="w-4 h-4 mr-2" />}
                    <Folder className="w-4 h-4 mr-2" />
                    {topFolder}
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    {Object.entries(subFolders).map(([subFolder, files]) => (
                      <div key={subFolder} className="ml-4 mt-1">
                        {files.map((file) => (
                          <Link key={file} href={`/edit/${topFolder}/${subFolder}`} className="flex items-center py-2 px-2 hover:bg-accent rounded-md transition-colors">
                            <FileText className="w-4 h-4 mr-2" />
                            {subFolder}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </aside>
  )
}