import type { Editor } from '@tiptap/react'
import { BubbleMenu } from '@tiptap/react/menus'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Link,
  Highlighter,
} from 'lucide-react'
import { cn } from '../../lib/utils'

interface EditorBubbleMenuProps {
  editor: Editor
}

interface BubbleButtonProps {
  onClick: () => void
  isActive?: boolean
  icon: React.ReactNode
  title: string
}

function BubbleButton({ onClick, isActive, icon, title }: BubbleButtonProps) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={cn(
        'p-1.5 rounded transition-colors',
        isActive
          ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'
          : 'text-gray-300 dark:text-gray-400 hover:text-white hover:bg-gray-600 dark:hover:bg-gray-600'
      )}
    >
      {icon}
    </button>
  )
}

export function EditorBubbleMenu({ editor }: EditorBubbleMenuProps) {
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
    <BubbleMenu
      editor={editor}
      className="flex items-center gap-0.5 bg-gray-800 dark:bg-gray-700 rounded-lg shadow-xl px-1 py-1 border border-gray-700 dark:border-gray-600"
    >
      <BubbleButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
        icon={<Bold className={iconSize} />}
        title="Negrito"
      />
      <BubbleButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
        icon={<Italic className={iconSize} />}
        title="Itálico"
      />
      <BubbleButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={editor.isActive('underline')}
        icon={<UnderlineIcon className={iconSize} />}
        title="Sublinhado"
      />
      <BubbleButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive('strike')}
        icon={<Strikethrough className={iconSize} />}
        title="Tachado"
      />
      <BubbleButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        isActive={editor.isActive('code')}
        icon={<Code className={iconSize} />}
        title="Código"
      />
      <BubbleButton
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        isActive={editor.isActive('highlight')}
        icon={<Highlighter className={iconSize} />}
        title="Destaque"
      />
      <div className="w-px h-5 bg-gray-600 mx-0.5" />
      <BubbleButton
        onClick={setLink}
        isActive={editor.isActive('link')}
        icon={<Link className={iconSize} />}
        title="Link"
      />
    </BubbleMenu>
  )
}
