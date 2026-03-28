import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
} from 'react'
import type { Note } from '../types'
import type { JSONContent } from '@tiptap/react'
import { generateId, extractTitle } from '../lib/utils'

const STORAGE_KEY = 'notebrains-notes'
const ACTIVE_KEY = 'notebrains-active'

interface NotesState {
  notes: Note[]
  activeNoteId: string | null
  searchQuery: string
}

type Action =
  | { type: 'CREATE_NOTE' }
  | { type: 'UPDATE_NOTE'; id: string; content: JSONContent }
  | { type: 'DELETE_NOTE'; id: string }
  | { type: 'SET_ACTIVE'; id: string | null }
  | { type: 'SET_SEARCH'; query: string }

interface NotesContextType extends NotesState {
  dispatch: React.Dispatch<Action>
  activeNote: Note | undefined
  filteredNotes: Note[]
}

const NotesContext = createContext<NotesContextType | null>(null)

function loadNotes(): Note[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function loadActiveId(): string | null {
  try {
    return localStorage.getItem(ACTIVE_KEY)
  } catch {
    return null
  }
}

function notesReducer(state: NotesState, action: Action): NotesState {
  switch (action.type) {
    case 'CREATE_NOTE': {
      const newNote: Note = {
        id: generateId(),
        title: 'Sem título',
        content: {
          type: 'doc',
          content: [{ type: 'paragraph' }],
        },
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }
      return {
        ...state,
        notes: [newNote, ...state.notes],
        activeNoteId: newNote.id,
      }
    }
    case 'UPDATE_NOTE': {
      const title = extractTitle(action.content)
      return {
        ...state,
        notes: state.notes.map((n) =>
          n.id === action.id
            ? { ...n, content: action.content, title, updatedAt: Date.now() }
            : n
        ),
      }
    }
    case 'DELETE_NOTE': {
      const remaining = state.notes.filter((n) => n.id !== action.id)
      return {
        ...state,
        notes: remaining,
        activeNoteId:
          state.activeNoteId === action.id
            ? remaining[0]?.id ?? null
            : state.activeNoteId,
      }
    }
    case 'SET_ACTIVE':
      return { ...state, activeNoteId: action.id }
    case 'SET_SEARCH':
      return { ...state, searchQuery: action.query }
    default:
      return state
  }
}

export function NotesProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(notesReducer, {
    notes: loadNotes(),
    activeNoteId: loadActiveId(),
    searchQuery: '',
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.notes))
  }, [state.notes])

  useEffect(() => {
    if (state.activeNoteId) {
      localStorage.setItem(ACTIVE_KEY, state.activeNoteId)
    } else {
      localStorage.removeItem(ACTIVE_KEY)
    }
  }, [state.activeNoteId])

  const activeNote = state.notes.find((n) => n.id === state.activeNoteId)

  const filteredNotes = state.notes
    .filter((n) =>
      state.searchQuery
        ? n.title.toLowerCase().includes(state.searchQuery.toLowerCase())
        : true
    )
    .sort((a, b) => b.updatedAt - a.updatedAt)

  return (
    <NotesContext.Provider
      value={{ ...state, dispatch, activeNote, filteredNotes }}
    >
      {children}
    </NotesContext.Provider>
  )
}

export function useNotes() {
  const ctx = useContext(NotesContext)
  if (!ctx) throw new Error('useNotes must be used within NotesProvider')
  return ctx
}
