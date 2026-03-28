import type { JSONContent } from '@tiptap/react'

export interface Note {
  id: string
  title: string
  content: JSONContent
  createdAt: number
  updatedAt: number
}
