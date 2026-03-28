import { ReactRenderer } from '@tiptap/react'
import tippy, { type Instance } from 'tippy.js'
import { CommandsList, slashCommands, type CommandItem } from './CommandsList'

export const suggestion = {
  items: ({ query }: { query: string }): CommandItem[] => {
    return slashCommands.filter((item) =>
      item.title.toLowerCase().includes(query.toLowerCase())
    )
  },

  render: () => {
    let component: ReactRenderer<any> | null = null
    let popup: Instance[] | null = null

    return {
      onStart: (props: any) => {
        component = new ReactRenderer(CommandsList, {
          props,
          editor: props.editor,
        })

        if (!props.clientRect) return

        popup = tippy('body', {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start',
        })
      },

      onUpdate: (props: any) => {
        component?.updateProps(props)

        if (!props.clientRect) return

        popup?.[0]?.setProps({
          getReferenceClientRect: props.clientRect,
        })
      },

      onKeyDown: (props: any) => {
        if (props.event.key === 'Escape') {
          popup?.[0]?.hide()
          return true
        }

        return component?.ref?.onKeyDown(props) ?? false
      },

      onExit: () => {
        popup?.[0]?.destroy()
        component?.destroy()
      },
    }
  },
}
