import { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react'
import {
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Code2,
  Quote,
  Minus,
  ImageIcon,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '../../../lib/utils'

export interface CommandItem {
  title: string
  description: string
  icon: LucideIcon
  command: (props: { editor: any; range: any }) => void
}

export const slashCommands: CommandItem[] = [
  {
    title: 'Heading 1',
    description: 'Título grande',
    icon: Heading1,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run()
    },
  },
  {
    title: 'Heading 2',
    description: 'Título médio',
    icon: Heading2,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run()
    },
  },
  {
    title: 'Heading 3',
    description: 'Título pequeno',
    icon: Heading3,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode('heading', { level: 3 }).run()
    },
  },
  {
    title: 'Bullet List',
    description: 'Lista com marcadores',
    icon: List,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run()
    },
  },
  {
    title: 'Numbered List',
    description: 'Lista numerada',
    icon: ListOrdered,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run()
    },
  },
  {
    title: 'Task List',
    description: 'Lista de tarefas com checkbox',
    icon: CheckSquare,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleTaskList().run()
    },
  },
  {
    title: 'Code Block',
    description: 'Bloco de código',
    icon: Code2,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleCodeBlock().run()
    },
  },
  {
    title: 'Blockquote',
    description: 'Citação em bloco',
    icon: Quote,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBlockquote().run()
    },
  },
  {
    title: 'Divider',
    description: 'Linha divisória',
    icon: Minus,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHorizontalRule().run()
    },
  },
  {
    title: 'Image',
    description: 'Inserir imagem via URL',
    icon: ImageIcon,
    command: ({ editor, range }) => {
      const url = window.prompt('URL da imagem:')
      if (url) {
        editor.chain().focus().deleteRange(range).setImage({ src: url }).run()
      }
    },
  },
]

interface CommandsListProps {
  items: CommandItem[]
  command: (item: CommandItem) => void
}

export const CommandsList = forwardRef<any, CommandsListProps>(
  ({ items, command }, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0)

    useEffect(() => {
      setSelectedIndex(0)
    }, [items])

    const selectItem = useCallback(
      (index: number) => {
        const item = items[index]
        if (item) command(item)
      },
      [items, command]
    )

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }: { event: KeyboardEvent }) => {
        if (event.key === 'ArrowUp') {
          setSelectedIndex((prev) => (prev + items.length - 1) % items.length)
          return true
        }
        if (event.key === 'ArrowDown') {
          setSelectedIndex((prev) => (prev + 1) % items.length)
          return true
        }
        if (event.key === 'Enter') {
          selectItem(selectedIndex)
          return true
        }
        return false
      },
    }))

    if (items.length === 0) {
      return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3 text-sm text-gray-500 dark:text-gray-400">
          Nenhum comando encontrado
        </div>
      )
    }

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden max-h-72 overflow-y-auto min-w-[220px]">
        {items.map((item, index) => {
          const Icon = item.icon
          return (
            <button
              key={item.title}
              onClick={() => selectItem(index)}
              className={cn(
                'flex items-center gap-3 w-full px-3 py-2 text-left transition-colors',
                index === selectedIndex
                  ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-100'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750'
              )}
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-md bg-gray-100 dark:bg-gray-700 shrink-0">
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {item.description}
                </p>
              </div>
            </button>
          )
        })}
      </div>
    )
  }
)

CommandsList.displayName = 'CommandsList'
