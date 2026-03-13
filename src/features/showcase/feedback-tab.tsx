import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { InboxIcon } from "lucide-react"
import { toast } from "sonner"

export function FeedbackTab() {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-4 text-xl font-semibold">Progress</h2>
        <div className="max-w-md space-y-4">
          <Progress value={33} />
          <Progress value={66} />
          <Progress value={100} />
        </div>
      </section>
      <section>
        <h2 className="mb-4 text-xl font-semibold">Skeleton</h2>
        <div className="max-w-md space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-20 w-full rounded-lg" />
        </div>
      </section>
      <section>
        <h2 className="mb-4 text-xl font-semibold">Spinner</h2>
        <div className="flex gap-4">
          <Spinner className="size-6" />
          <Spinner className="size-8" />
          <Spinner className="size-10" />
        </div>
      </section>
      <section>
        <h2 className="mb-4 text-xl font-semibold">Empty State</h2>
        <Empty className="rounded-lg border">
          <EmptyContent>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <InboxIcon />
              </EmptyMedia>
              <EmptyTitle>No items yet</EmptyTitle>
              <EmptyDescription>
                Get started by creating your first item.
              </EmptyDescription>
            </EmptyHeader>
            <Button size="sm">Create item</Button>
          </EmptyContent>
        </Empty>
      </section>
      <section>
        <h2 className="mb-4 text-xl font-semibold">Toast (Sonner)</h2>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => toast.success("Success message")}
          >
            Success toast
          </Button>
          <Button
            variant="outline"
            onClick={() => toast.error("Error message")}
          >
            Error toast
          </Button>
          <Button variant="outline" onClick={() => toast("Default toast")}>
            Default toast
          </Button>
        </div>
      </section>
    </div>
  )
}
