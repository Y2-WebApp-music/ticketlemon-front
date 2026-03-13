import { cn } from "@/lib/utils"
import type EditorJS from "@editorjs/editorjs"
import type { API, EditorConfig, OutputData } from "@editorjs/editorjs"
import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react"

export interface EditorJsProps {
  /** Initial data to render (blocks) */
  initialData?: OutputData
  /** Custom tools config; omit to use Editor.js 2 built-in paragraph */
  tools?: EditorConfig["tools"]
  /** Placeholder for the first block */
  placeholder?: string | false
  /** Minimum height of the editor area (px) */
  minHeight?: number
  /** Read-only mode */
  readOnly?: boolean
  /** Called when the editor is ready */
  onReady?: () => void
  /** Called when content changes */
  onChange?: (api: API) => void
  /** Class name for the holder element */
  className?: string
  /** Enable autofocus on mount */
  autofocus?: boolean
  /** Optional children (e.g. toolbar to show/save data), rendered inside the editor context */
  children?: React.ReactNode
}

const EditorJsContext = createContext<{ editor: EditorJS | null }>({
  editor: null,
})

export function useEditorJs() {
  const ctx = useContext(EditorJsContext)
  if (!ctx) throw new Error("useEditorJs must be used within EditorJs")
  return ctx
}

export function EditorJs({
  initialData,
  tools,
  placeholder = "Write your content…",
  minHeight = 0,
  readOnly = false,
  onReady,
  onChange,
  className,
  autofocus = false,
  children,
}: EditorJsProps) {
  const holderId = useId().replace(/:/g, "-")
  const editorRef = useRef<EditorJS | null>(null)
  const [editor, setEditor] = useState<EditorJS | null>(null)
  const onChangeRef = useRef(onChange)
  const onReadyRef = useRef(onReady)
  onChangeRef.current = onChange
  onReadyRef.current = onReady

  useEffect(() => {
    const init = async () => {
      const { default: EditorJSConstructor } =
        await import("@editorjs/editorjs")

      const config: EditorConfig = {
        holder: holderId,
        data: initialData,
        placeholder,
        minHeight: minHeight || undefined,
        readOnly,
        autofocus,
        tools,
        ...(tools && "paragraph" in tools && { defaultBlock: "paragraph" }),
        async onReady() {
          const instance = editorRef.current
          if (instance) setEditor(instance)
          if (!readOnly) {
            // @ts-expect-error - no types for editorjs-drag-drop
            const { default: DragDrop } = await import("editorjs-drag-drop")
            new DragDrop(instance)
          }
          onReadyRef.current?.()
        },
        onChange(api) {
          onChangeRef.current?.(api)
        },
      }

      const instance = new EditorJSConstructor(config) as EditorJS
      editorRef.current = instance
    }

    init()

    return () => {
      editorRef.current?.destroy()
      editorRef.current = null
      setEditor(null)
    }
  }, [holderId]) // eslint-disable-line react-hooks/exhaustive-deps -- only init once per holder

  return (
    <EditorJsContext.Provider value={{ editor }}>
      {children}
      <div id={holderId} className={cn("editor-js-holder", className)} />
    </EditorJsContext.Provider>
  )
}

/** Save the current editor content (use from a parent that has access to the editor instance via ref or context). */
export async function saveEditor(
  editor: EditorJS | null
): Promise<OutputData | null> {
  if (!editor) return null
  return editor.save()
}
