import { toast } from "@/hooks/use-toast"
import { useAuth } from '@/app/services/auth-service'

export interface BlobData {
  url: string
  pathname: string
}

export function useStorage() {
  const { isAdmin } = useAuth()

  const saveFile = async (name: string, content: string) => {
    if (isAdmin) {
      try {
        const response = await fetch("/api/data", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ path: name, content }),
        })
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      } catch (error) {
        console.error("Error saving file:", error)
        toast({
          title: "Error",
          description: "Failed to save file. Please try again.",
          variant: "destructive",
        })
      }
    } else {
      localStorage.setItem(name, content)
    }
  }

  const getFiles = async (): Promise<BlobData[]> => {
    if (isAdmin) {
      try {
        const response = await fetch("/api/data?path=content/")
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
        const data: { blobs: BlobData[] } = await response.json()
        return data.blobs
      } catch (error) {
        console.error("Error fetching files:", error)
        toast({
          title: "Error",
          description: "Failed to fetch files. Please try again.",
          variant: "destructive",
        })
        return []
      }
    } else {
      return Object.keys(localStorage).map(key => ({ pathname: key, url: key }))
    }
  }

  const getFileContent = async (name: string): Promise<string | null> => {
    if (isAdmin) {
      try {
        const response = await fetch(`/api/data?path=${name}`)
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
        const data: { blobs: BlobData[] } = await response.json()
        const file = data.blobs.find((blob) => blob.pathname === name)
        if (file) {
          const contentResponse = await fetch(file.url)
          return await contentResponse.text()
        }
        return null
      } catch (error) {
        console.error("Error fetching file content:", error)
        toast({
          title: "Error",
          description: "Failed to fetch file content. Please try again.",
          variant: "destructive",
        })
        return null
      }
    } else {
      return localStorage.getItem(name)
    }
  }

  const deleteFile = async (name: string) => {
    if (isAdmin) {
      try {
        const response = await fetch("/api/data", {
          method: "DELETE",
          headers: { 
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: name }),
        })
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      } catch (error) {
        console.error("Error deleting file:", error)
        toast({
          title: "Error",
          description: "Failed to delete file. Please try again.",
          variant: "destructive",
        })
      }
    } else {
      localStorage.removeItem(name)
    }
  }

  return { saveFile, getFiles, getFileContent, deleteFile, isAdmin }
}