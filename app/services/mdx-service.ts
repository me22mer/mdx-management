import { toast } from "@/hooks/use-toast"
import { format } from 'date-fns'
import { serialize } from "next-mdx-remote/serialize"

export interface BlobData {
  url: string
  pathname: string
}

interface FolderStructure {
  blog: BlobData[]
  projects: BlobData[]
}

type CategoryType = "blog" | "projects"

const getLocalStorage = () => {
  if (typeof window !== 'undefined') {
    return window.localStorage
  }
  return null
}

export const createNewItem = async (newItemType: CategoryType, newItemName: string, isAdmin: boolean) => {
  const currentDate = format(new Date(), 'M/d/yyyy')
  const content = newItemType === 'blog'
    ? `
<MDXMetadata 
  type="blog"
  title="${newItemName.trim()}"
  description="Welcome to my new blog post! Let's explore this topic together."
  publishedAt="${currentDate}"
  readingTime="2 min"
  published={false}
  tags={["blog"]}
/>

## Introduction

Start writing your blog post here...
`
    : `
<MDXMetadata 
  type="project"
  title="${newItemName.trim()}"
  description="A brief description of your project goes here."
  publishedAt="${currentDate}"
  repository="https://github.com/yourusername/${newItemName.trim()}"
  url=""
  tags={["Next.js", "React", "TypeScript"]}
  status="In Progress"
/>

## Project Overview

Start describing your project here...
`

  try {
    if (isAdmin) {
      const response = await fetch("/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: `content/${newItemType}/${newItemName.trim()}/page.mdx`,
          content,
        }),
      })

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    } else {
      const localStorage = getLocalStorage()
      if (localStorage) {
        const key = `${newItemType}/${newItemName.trim()}`
        localStorage.setItem(key, content)
      } else {
        throw new Error("localStorage is not available")
      }
    }

    toast({
      title: "Success",
      description: `New ${newItemType} created successfully.`,
    })

    return true
  } catch (error) {
    console.error("Error creating new item:", error)
    toast({
      title: "Error",
      description: "Failed to create new item. Please try again.",
      variant: "destructive",
    })
    return false
  }
}

export const fetchBlobData = async (isAdmin: boolean): Promise<FolderStructure | null> => {
  try {
    if (isAdmin) {
      const response = await fetch("/api/data?path=content/")
      if (!response.ok) {
        if (response.status === 401) {
          toast({
            title: "Authentication Error",
            description: "Please log in to access content.",
            variant: "destructive",
          })
          return null
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data: { blobs: BlobData[] } = await response.json()
      const structure: FolderStructure = { blog: [], projects: [] }

      data.blobs.forEach((blob: BlobData) => {
        const [, category] = blob.pathname.split("/")
        if (category === "blog" || category === "projects") {
          structure[category].push(blob)
        }
      })

      return structure
    } else {
      const localStorage = getLocalStorage()
      if (localStorage) {
        const structure: FolderStructure = { blog: [], projects: [] }
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)
          if (key) {
            const [category] = key.split('/')
            if (category === 'blog' || category === 'projects') {
              structure[category].push({
                url: key,
                pathname: `content/${key}/page.mdx`
              })
            }
          }
        }
        return structure
      }
      return null
    }
  } catch (error) {
    console.error("Error fetching blob data:", error)
    toast({
      title: "Error",
      description: "Failed to fetch content. Please try again.",
      variant: "destructive",
    })
    return null
  }
}

export const updatePreview = async (mdxContent: string) => {
  try {
    return await serialize(mdxContent)
  } catch (error) {
    console.error("Error compiling MDX:", error)
    return null
  }
}

export const saveContent = async (path: string, content: string, isAdmin: boolean) => {
  try {
    if (isAdmin) {
      const checkResponse = await fetch(`/api/data?path=${path}`)
      const checkData: { blobs: BlobData[] } = await checkResponse.json()
      const existingFile = checkData.blobs.find((blob) => blob.pathname.startsWith(path))

      const newFilePath = `${path}/page.mdx`
      const createResponse = await fetch("/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: newFilePath, content }),
      })

      if (!createResponse.ok) {
        const errorText = await createResponse.text()
        throw new Error(`HTTP error! status: ${createResponse.status}, message: ${errorText}`)
      }

      if (existingFile) {
        await fetch("/api/data", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: existingFile.url }),
        })
      }
    } else {
      const localStorage = getLocalStorage()
      if (localStorage) {
        localStorage.setItem(path, content)
      } else {
        throw new Error("localStorage is not available")
      }
    }

    toast({
      title: "File saved",
      description: "Your file has been saved successfully.",
    })

    return true
  } catch (error) {
    console.error("Error saving content:", error)
    toast({
      title: "Error",
      description: "Failed to save content. Please try again.",
      variant: "destructive",
    })
    return false
  }
}