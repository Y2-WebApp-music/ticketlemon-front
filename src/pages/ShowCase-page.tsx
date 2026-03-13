import { useTheme } from "@/components/theme-provider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ButtonsBadgesTab,
  CardsTab,
  DataDisplayTab,
  EditorJsTab,
  FeedbackTab,
  FormsTab,
  OverlaysTab,
  ShowcaseHeader,
} from "@/features/showcase"
import { useState } from "react"

export default function ShowCasePage() {
  const { theme, setTheme } = useTheme()
  const [collapsibleOpen, setCollapsibleOpen] = useState(false)

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ShowcaseHeader theme={theme as "dark" | "light"} onToggleTheme={toggleTheme} />

      <main className="w-full px-10 py-8">
        <Tabs defaultValue="buttons" className="w-full">
          <TabsList className="mb-6 flex w-full lg:w-auto">
            <TabsTrigger value="buttons">Buttons & Badges</TabsTrigger>
            <TabsTrigger value="forms">Form Controls</TabsTrigger>
            <TabsTrigger value="cards">Cards & Layout</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
            <TabsTrigger value="overlays">Overlays</TabsTrigger>
            <TabsTrigger value="data">Data Display</TabsTrigger>
            <TabsTrigger value="editorjs">EditorJS</TabsTrigger>
          </TabsList>

          <TabsContent value="buttons" className="space-y-8">
            <ButtonsBadgesTab />
          </TabsContent>
          <TabsContent value="forms" className="space-y-8">
            <FormsTab />
          </TabsContent>
          <TabsContent value="cards" className="space-y-8">
            <CardsTab />
          </TabsContent>
          <TabsContent value="feedback" className="space-y-8">
            <FeedbackTab />
          </TabsContent>
          <TabsContent value="overlays" className="space-y-8">
            <OverlaysTab />
          </TabsContent>
          <TabsContent value="data" className="space-y-8">
            <DataDisplayTab
              collapsibleOpen={collapsibleOpen}
              onCollapsibleOpenChange={setCollapsibleOpen}
            />
          </TabsContent>
          <TabsContent value="editorjs" className="space-y-8">
            <EditorJsTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
