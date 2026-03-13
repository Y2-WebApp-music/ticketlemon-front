import { EditorJs, defaultEditorTools } from "@/components/editor-js"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { OutputData } from "@editorjs/editorjs"

export interface DescriptionSectionProps {
  sectionRef: (el: HTMLElement | null) => void
  value: OutputData | null
  onChange: (data: OutputData | null) => void
}

export function DescriptionSection({
  sectionRef,
  value,
  onChange,
}: DescriptionSectionProps) {
  return (
    <section ref={sectionRef} id="event-description">
      <Card size="sm" className="gap-0 py-0">
        <CardHeader>
          <CardTitle>Description</CardTitle>
          <p className="text-sm text-muted-foreground">
            Add your description helps attendees understand what your event is
            about.
          </p>
        </CardHeader>
        <CardContent>
          <div className="min-h-[200px] rounded-lg border border-input pt-4">
            <EditorJs
              initialData={value ?? undefined}
              tools={defaultEditorTools}
              placeholder="Type text to put a description."
              minHeight={200}
              readOnly={false}
              className="min-h-[200px]"
              onChange={async (api) => {
                try {
                  const data = await api.saver.save()
                  onChange(data)
                } catch {
                  onChange(null)
                }
              }}
            />
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
