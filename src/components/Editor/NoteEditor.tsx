import { useEffect, useRef, useCallback } from 'react'
import { useEditor, EditorContent, Extension } from '@tiptap/react'
import { PluginKey } from '@tiptap/pm/state'
import Suggestion from '@tiptap/suggestion'
import { extensions } from './extensions'
import { suggestion } from './SlashCommand/suggestion'
import { MenuBar } from './MenuBar'
import { EditorBubbleMenu } from './EditorBubbleMenu'
import { useNotes } from '../../store/NotesContext'
import type { JSONContent } from '@tiptap/react'

const SlashCommands = Extension.create({
  name: 'slash-commands',

  addOptions() {
    return {
      suggestion: {
        char: '/',
        command: ({ editor, range, props }: any) => {
          props.command({ editor, range })
        },
      },
    }
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
        pluginKey: new PluginKey('slash-commands'),
      }),
    ]
  },
})

export function NoteEditor() {
  const { activeNote, dispatch } = useNotes()
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null)
  const isUpdatingRef = useRef(false)

  const handleUpdate = useCallback(
    (content: JSONContent) => {
      if (!activeNote || isUpdatingRef.current) return
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        dispatch({ type: 'UPDATE_NOTE', id: activeNote.id, content })
      }, 300)
    },
    [activeNote, dispatch]
  )

  const editor = useEditor({
    extensions: [
      ...extensions,
      SlashCommands.configure({
        suggestion,
      }),
    ],
    content: activeNote?.content || { type: 'doc', content: [{ type: 'paragraph' }] },
    onUpdate: ({ editor }) => {
      handleUpdate(editor.getJSON())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-gray dark:prose-invert max-w-none focus:outline-none min-h-[calc(100vh-8rem)] px-8 py-6 lg:px-16',
      },
    },
  })

  useEffect(() => {
    if (editor && activeNote) {
      const currentContent = JSON.stringify(editor.getJSON())
      const newContent = JSON.stringify(activeNote.content)
      if (currentContent !== newContent) {
        isUpdatingRef.current = true
        editor.commands.setContent(activeNote.content)
        isUpdatingRef.current = false
      }
    }
  }, [activeNote?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  if (!editor) return null

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 overflow-hidden">
      <MenuBar editor={editor} />
      <div className="flex-1 overflow-y-auto">
        <EditorBubbleMenu editor={editor} />
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
