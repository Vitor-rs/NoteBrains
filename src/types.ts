import type { JSONContent } from '@tiptap/react'

export interface Note {
  id: string
  title: string
  content: JSONContent
  tags: string[]
  createdAt: number
  updatedAt: number
}

// Predefined tag colors for the knowledge graph
export const TAG_COLORS: Record<string, string> = {
  ideias: '#6366f1',
  projeto: '#f59e0b',
  estudo: '#10b981',
  trabalho: '#ef4444',
  pessoal: '#8b5cf6',
  referência: '#06b6d4',
  tarefa: '#f97316',
  inspiração: '#ec4899',
  código: '#14b8a6',
  design: '#a855f7',
}

export const DEFAULT_TAGS = Object.keys(TAG_COLORS)

export function getTagColor(tag: string): string {
  if (TAG_COLORS[tag.toLowerCase()]) return TAG_COLORS[tag.toLowerCase()]
  // Generate a consistent color from the tag string
  let hash = 0
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash)
  }
  const hue = Math.abs(hash % 360)
  return `hsl(${hue}, 70%, 55%)`
}
