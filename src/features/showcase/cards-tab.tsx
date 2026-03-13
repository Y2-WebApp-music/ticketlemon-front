import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function CardsTab() {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-4 text-xl font-semibold">Card</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card description goes here.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Card content area. You can put any content inside.</p>
            </CardContent>
            <CardFooter>
              <Button size="sm">Action</Button>
            </CardFooter>
          </Card>
          <Card size="sm">
            <CardHeader>
              <CardTitle>Small Card</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Compact card variant.</p>
            </CardContent>
          </Card>
        </div>
      </section>
      <section>
        <h2 className="mb-4 text-xl font-semibold">Aspect Ratio</h2>
        <AspectRatio
          ratio={16 / 9}
          className="max-w-md overflow-hidden rounded-lg bg-muted"
        >
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            16:9 placeholder
          </div>
        </AspectRatio>
      </section>
    </div>
  )
}
