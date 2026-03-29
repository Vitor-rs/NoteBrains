import { useState } from 'react'
import { X, Plus, Tag } from 'lucide-react'
import { useNotes } from '../../store/NotesContext'
import { DEFAULT_TAGS, getTagColor } from '../../types'
import { cn } from '../../lib/utils'

export function TagsBar() {
  const { activeNote, dispatch } = useNotes()
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [inputValue, setInputValue] = useState('')

  if (!activeNote) return null

  const addTag = (tag: string) => {
    const normalized = tag.toLowerCase().trim()
    if (!normalized || activeNote.tags.includes(normalized)) return
    dispatch({
      type: 'UPDATE_TAGS',
      id: activeNote.id,
      tags: [...activeNote.tags, normalized],
    })
    setInputValue('')
    setShowSuggestions(false)
  }

  const removeTag = (tag: string) => {
    dispatch({
      type: 'UPDATE_TAGS',
      id: activeNote.id,
      tags: activeNote.tags.filter((t) => t !== tag),
    })
  }

  const suggestions = DEFAULT_TAGS.filter(
    (t) =>
      !activeNote.tags.includes(t) &&
      t.includes(inputValue.toLowerCase())
  )

  return (
    <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 flex-wrap">
      <Tag className="w-3.5 h-3.5 text-gray-400 shrink-0" />

      {activeNote.tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium text-white"
          style={{ backgroundColor: getTagColor(tag) }}
        >
          {tag}
          <button
            onClick={() => removeTag(tag)}
            className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
          >
            <X className="w-2.5 h-2.5" />
          </button>
        </span>
      ))}

      <div className="relative">
        <div className="flex items-center">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value)
              setShowSuggestions(true)
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && inputValue.trim()) {
                addTag(inputValue)
              }
            }}
            placeholder="+ tag"
            className="w-16 text-xs bg-transparent border-none outline-none text-gray-500 dark:text-gray-400 placeholder-gray-400 dark:placeholder-gray-600"
          />
          {inputValue && (
            <button
              onClick={() => addTag(inputValue)}
              className="p-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400"
            >
              <Plus className="w-3 h-3" />
            </button>
          )}
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 py-1 min-w-[140px]">
            {suggestions.map((tag) => (
              <button
                key={tag}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => addTag(tag)}
                className={cn(
                  'flex items-center gap-2 w-full px-3 py-1.5 text-xs text-left',
                  'hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'
                )}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: getTagColor(tag) }}
                />
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
