import { FileText, Plus } from 'lucide-react'
import { useNotes } from '../store/NotesContext'

export function EmptyState() {
  const { dispatch } = useNotes()

  return (
    <div className="flex-1 flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="text-center max-w-sm">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 mb-4">
          <FileText className="w-8 h-8 text-gray-400 dark:text-gray-500" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Nenhuma nota selecionada
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Selecione uma nota na sidebar ou crie uma nova para começar a escrever.
        </p>
        <button
          onClick={() => dispatch({ type: 'CREATE_NOTE' })}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nova Nota
        </button>

        <div className="mt-10 text-left">
          <p className="text-xs font-medium text-gray-400 dark:text-gray-500 mb-3 uppercase tracking-wider">
            Atalhos
          </p>
          <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex justify-between">
              <span>Negrito</span>
              <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">Ctrl+B</kbd>
            </div>
            <div className="flex justify-between">
              <span>Itálico</span>
              <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">Ctrl+I</kbd>
            </div>
            <div className="flex justify-between">
              <span>Sublinhado</span>
              <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">Ctrl+U</kbd>
            </div>
            <div className="flex justify-between">
              <span>Comandos</span>
              <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">/</kbd>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
