import { useState, useEffect, useCallback } from 'react'
import { NotesProvider, useNotes } from './store/NotesContext'
import { Sidebar } from './components/Sidebar/Sidebar'
import { NoteEditor } from './components/Editor/NoteEditor'
import { EmptyState } from './components/EmptyState'
import { KnowledgeGraph } from './components/Graph/KnowledgeGraph'

const THEME_KEY = 'notebrains-theme'

function AppContent() {
  const { activeNote, dispatch } = useNotes()
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem(THEME_KEY)
    if (saved) return saved === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showGraph, setShowGraph] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light')
  }, [isDark])

  const handleGraphNodeClick = useCallback(
    (noteId: string) => {
      dispatch({ type: 'SET_ACTIVE', id: noteId })
      setShowGraph(false)
    },
    [dispatch]
  )

  return (
    <div className="h-screen flex overflow-hidden bg-white dark:bg-gray-900">
      <Sidebar
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        showGraph={showGraph}
        onToggleGraph={() => setShowGraph(!showGraph)}
      />
      {showGraph ? (
        <KnowledgeGraph onNodeClick={handleGraphNodeClick} />
      ) : activeNote ? (
        <NoteEditor />
      ) : (
        <EmptyState />
      )}
    </div>
  )
}

export default function App() {
  return (
    <NotesProvider>
      <AppContent />
    </NotesProvider>
  )
}
