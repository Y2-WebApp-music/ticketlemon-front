import { EditorJs, defaultEditorTools } from "@/components/editor-js"
import { Button } from "@/components/ui/button"
import type { OutputData } from "@editorjs/editorjs"
import { useState } from "react"

export interface EditorJsTabProps {
  initialData?: OutputData | null
}

export function EditorJsTab({ initialData = null }: EditorJsTabProps) {
  const [editorData, setEditorData] = useState<OutputData | null>(
    initialData ?? null
  )
  const [editorReadOnly, setEditorReadOnly] = useState(false)

  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-4 text-xl font-semibold">EditorJS</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Rich text block editor. Type or paste content below. The output data
          (blocks) is shown underneath.
        </p>
        <div className="mb-3 flex items-center gap-2">
          <Button
            type="button"
            variant={editorReadOnly ? "default" : "outline"}
            size="sm"
            onClick={() => setEditorReadOnly((v) => !v)}
          >
            {editorReadOnly ? "Read-only" : "Editing"}
          </Button>
          <span className="text-xs text-muted-foreground">
            {editorReadOnly
              ? "Click to enable editing"
              : "Click to switch to read-only"}
          </span>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <EditorJs
            key={`editor-${editorReadOnly ? "readonly" : "edit"}`}
            tools={defaultEditorTools}
            placeholder="Start writing or paste content…"
            minHeight={200}
            autofocus={false}
            readOnly={editorReadOnly}
            initialData={editorData ?? undefined}
            onChange={async (api) => {
              try {
                const data = await api.saver.save()
                setEditorData(data)
              } catch {
                setEditorData(null)
              }
            }}
          />
        </div>
        <div className="mt-4 space-y-2">
          <h3 className="text-sm font-medium">Output data</h3>
          <pre className="max-h-[80vh] overflow-auto rounded-lg border bg-muted/50 p-4 text-xs">
            <code className="text-foreground">
              {editorData
                ? JSON.stringify(editorData, null, 2)
                : "No data yet. Type in the editor above."}
            </code>
          </pre>
        </div>
      </section>
    </div>
  )
}
