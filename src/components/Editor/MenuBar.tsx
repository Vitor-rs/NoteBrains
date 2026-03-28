import type { Editor } from '@tiptap/react'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Code2,
  Minus,
  ImageIcon,
  Link,
  Highlighter,
  Undo2,
  Redo2,
} from 'lucide-react'
import { cn } from '../../lib/utils'

interface MenuBarProps {
  editor: Editor
}

interface MenuButtonProps {
  onClick: () => void
  isActive?: boolean
  icon: React.ReactNode
  title: string
  disabled?: boolean
}

function MenuButton({ onClick, isActive, icon, title, disabled }: MenuButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        'p-1.5 rounded-md transition-colors',
        isActive
          ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400'
          : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300',
        disabled && 'opacity-40 cursor-not-allowed'
      )}
    >
      {icon}
    </button>
  )
}

function Separator() {
  return <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-0.5" />
}

export function MenuBar({ editor }: MenuBarProps) {
  const addImage = () => {
    const url = window.prompt('URL da imagem:')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL do link:', previousUrl)
    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  const iconSize = 'w-4 h-4'

  return (
    <div className="flex items-center gap-0.5 px-3 py-2 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex-wrap">
      {/* Undo/Redo */}
      <MenuButton
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        icon={<Undo2 className={iconSize} />}
        title="Desfazer (Ctrl+Z)"
      />
      <MenuButton
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        icon={<Redo2 className={iconSize} />}
        title="Refazer (Ctrl+Shift+Z)"
      />

      <Separator />

      {/* Text formatting */}
      <MenuButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
        icon={<Bold className={iconSize} />}
        title="Negrito (Ctrl+B)"
      />
      <MenuButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
        icon={<Italic className={iconSize} />}
        title="Itálico (Ctrl+I)"
      />
      <MenuButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={editor.isActive('underline')}
        icon={<UnderlineIcon className={iconSize} />}
        title="Sublinhado (Ctrl+U)"
      />
      <MenuButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive('strike')}
        icon={<Strikethrough className={iconSize} />}
        title="Tachado (Ctrl+Shift+X)"
      />
      <MenuButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        isActive={editor.isActive('code')}
        icon={<Code className={iconSize} />}
        title="Código inline (Ctrl+E)"
      />
      <MenuButton
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        isActive={editor.isActive('highlight')}
        icon={<Highlighter className={iconSize} />}
        title="Destaque"
      />

      <Separator />

      {/* Headings */}
      <MenuButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        isActive={editor.isActive('heading', { level: 1 })}
        icon={<Heading1 className={iconSize} />}
        title="Título 1"
      />
      <MenuButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive('heading', { level: 2 })}
        icon={<Heading2 className={iconSize} />}
        title="Título 2"
      />
      <MenuButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        isActive={editor.isActive('heading', { level: 3 })}
        icon={<Heading3 className={iconSize} />}
        title="Título 3"
      />

      <Separator />

      {/* Lists */}
      <MenuButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}
        icon={<List className={iconSize} />}
        title="Lista com marcadores"
      />
      <MenuButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive('orderedList')}
        icon={<ListOrdered className={iconSize} />}
        title="Lista numerada"
      />
      <MenuButton
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        isActive={editor.isActive('taskList')}
        icon={<CheckSquare className={iconSize} />}
        title="Lista de tarefas"
      />

      <Separator />

      {/* Blocks */}
      <MenuButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive('blockquote')}
        icon={<Quote className={iconSize} />}
        title="Citação"
      />
      <MenuButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        isActive={editor.isActive('codeBlock')}
        icon={<Code2 className={iconSize} />}
        title="Bloco de código"
      />
      <MenuButton
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        icon={<Minus className={iconSize} />}
        title="Divisor"
      />

      <Separator />

      {/* Link & Image */}
      <MenuButton
        onClick={setLink}
        isActive={editor.isActive('link')}
        icon={<Link className={iconSize} />}
        title="Link"
      />
      <MenuButton
        onClick={addImage}
        icon={<ImageIcon className={iconSize} />}
        title="Imagem"
      />
    </div>
  )
}
