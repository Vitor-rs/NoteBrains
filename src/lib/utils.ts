import { clsx, type ClassValue } from 'clsx'
import type { JSONContent } from '@tiptap/react'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function generateId(): string {
  return crypto.randomUUID()
}

export function formatDate(timestamp: number): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Agora'
  if (minutes < 60) return `${minutes}min atrás`
  if (hours < 24) return `${hours}h atrás`
  if (days < 7) return `${days}d atrás`

  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
  })
}

export function extractTitle(content: JSONContent | undefined): string {
  if (!content || !content.content || content.content.length === 0) return 'Sem título'

  for (const node of content.content) {
    if (node.type === 'heading' || node.type === 'paragraph') {
      const text = (node.content as JSONContent[] | undefined)
        ?.map((c) => c.text || '')
        .join('')
        .trim()
      if (text) return text.slice(0, 60)
    }
  }

  return 'Sem título'
}
