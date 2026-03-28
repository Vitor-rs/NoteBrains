import { useState, useEffect } from 'react'
import { NotesProvider, useNotes } from './store/NotesContext'
import { Sidebar } from './components/Sidebar/Sidebar'
import { NoteEditor } from './components/Editor/NoteEditor'
import { EmptyState } from './components/EmptyState'

const THEME_KEY = 'notebrains-theme'

function AppContent() {
  const { activeNote } = useNotes()
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem(THEME_KEY)
    if (saved) return saved === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light')
  }, [isDark])

  return (
    <div className="h-screen flex overflow-hidden bg-white dark:bg-gray-900">
      <Sidebar
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      {activeNote ? <NoteEditor /> : <EmptyState />}
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
