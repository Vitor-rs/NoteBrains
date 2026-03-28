import { Trash2, FileText } from 'lucide-react'
import { cn, formatDate } from '../../lib/utils'
import type { Note } from '../../types'

interface NoteItemProps {
  note: Note
  isActive: boolean
  onSelect: () => void
  onDelete: () => void
}

export function NoteItem({ note, isActive, onSelect, onDelete }: NoteItemProps) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        'w-full text-left px-3 py-2.5 rounded-lg transition-colors group relative',
        isActive
          ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-100'
          : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
      )}
    >
      <div className="flex items-start gap-2.5">
        <FileText className="w-4 h-4 mt-0.5 shrink-0 text-gray-400 dark:text-gray-500" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium truncate">{note.title}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            {formatDate(note.updatedAt)}
          </p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 transition-all shrink-0"
          title="Deletar nota"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </button>
  )
}
