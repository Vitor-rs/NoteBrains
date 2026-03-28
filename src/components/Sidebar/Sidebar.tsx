import { Plus, Search, Sun, Moon, PanelLeftClose, PanelLeft, Brain } from 'lucide-react'
import { useNotes } from '../../store/NotesContext'
import { NoteItem } from './NoteItem'
import { cn } from '../../lib/utils'

interface SidebarProps {
  isDark: boolean
  onToggleTheme: () => void
  isOpen: boolean
  onToggle: () => void
}

export function Sidebar({ isDark, onToggleTheme, isOpen, onToggle }: SidebarProps) {
  const { filteredNotes, activeNoteId, searchQuery, dispatch } = useNotes()

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-20 lg:hidden"
          onClick={onToggle}
        />
      )}

      <aside
        className={cn(
          'fixed lg:relative z-30 h-full flex flex-col bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300',
          isOpen ? 'w-72 translate-x-0' : 'w-0 -translate-x-full lg:w-0'
        )}
      >
        <div className="flex flex-col h-full min-w-[18rem]">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-indigo-500" />
              <h1 className="font-bold text-lg text-gray-900 dark:text-white">
                NoteBrains
              </h1>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={onToggleTheme}
                className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
                title={isDark ? 'Modo claro' : 'Modo escuro'}
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <button
                onClick={onToggle}
                className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
                title="Fechar sidebar"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* New Note */}
          <div className="px-3 py-3">
            <button
              onClick={() => dispatch({ type: 'CREATE_NOTE' })}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nova Nota
            </button>
          </div>

          {/* Search */}
          <div className="px-3 pb-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar notas..."
                value={searchQuery}
                onChange={(e) =>
                  dispatch({ type: 'SET_SEARCH', query: e.target.value })
                }
                className="w-full pl-8 pr-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-colors"
              />
            </div>
          </div>

          {/* Notes List */}
          <div className="flex-1 overflow-y-auto px-2 pb-3 space-y-0.5">
            {filteredNotes.length === 0 ? (
              <p className="text-center text-sm text-gray-400 dark:text-gray-500 py-8">
                {searchQuery ? 'Nenhuma nota encontrada' : 'Nenhuma nota ainda'}
              </p>
            ) : (
              filteredNotes.map((note) => (
                <NoteItem
                  key={note.id}
                  note={note}
                  isActive={note.id === activeNoteId}
                  onSelect={() => dispatch({ type: 'SET_ACTIVE', id: note.id })}
                  onDelete={() => dispatch({ type: 'DELETE_NOTE', id: note.id })}
                />
              ))
            )}
          </div>
        </div>
      </aside>

      {/* Toggle button when collapsed */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed top-3 left-3 z-10 p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 shadow-sm transition-colors"
          title="Abrir sidebar"
        >
          <PanelLeft className="w-5 h-5" />
        </button>
      )}
    </>
  )
}
