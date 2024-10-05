/* eslint-disable jsx-a11y/alt-text */
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Image,
  Link as LinkIcon,
} from "lucide-react"
import { Button } from "./ui/button"

type ToolbarAction = 'bold' | 'italic' | 'unordered-list' | 'ordered-list' | 'image' | 'link'

interface EditToolbarProps {
  onAction: (action: ToolbarAction) => void
}

export function EditToolbar({ onAction }: EditToolbarProps) {
  return (
    <div className="flex items-center space-x-2 mb-4 p-2 bg-secondary rounded-md">
      <Button variant="ghost" size="sm" onClick={() => onAction('bold')}>
        <Bold className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => onAction('italic')}>
        <Italic className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => onAction('unordered-list')}>
        <List className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => onAction('ordered-list')}>
        <ListOrdered className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => onAction('image')}>
        <Image className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => onAction('link')}>
        <LinkIcon className="w-4 h-4" />
      </Button>
    </div>
  )
}