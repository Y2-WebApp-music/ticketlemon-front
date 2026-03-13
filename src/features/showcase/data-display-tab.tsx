import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface DataDisplayTabProps {
  collapsibleOpen: boolean
  onCollapsibleOpenChange: (open: boolean) => void
}

export function DataDisplayTab({
  collapsibleOpen,
  onCollapsibleOpenChange,
}: DataDisplayTabProps) {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-4 text-xl font-semibold">Tabs</h2>
        <Tabs defaultValue="tab1" className="max-w-md">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
            <TabsTrigger value="tab3">Tab 3</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1" className="rounded-md border p-4">
            Content for tab 1.
          </TabsContent>
          <TabsContent value="tab2" className="rounded-md border p-4">
            Content for tab 2.
          </TabsContent>
          <TabsContent value="tab3" className="rounded-md border p-4">
            Content for tab 3.
          </TabsContent>
        </Tabs>
      </section>
      <section>
        <h2 className="mb-4 text-xl font-semibold">Accordion</h2>
        <Accordion type="single" collapsible className="max-w-md">
          <AccordionItem value="item-1">
            <AccordionTrigger>Is it accessible?</AccordionTrigger>
            <AccordionContent>
              Yes. It uses Radix UI primitives under the hood.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Is it styled?</AccordionTrigger>
            <AccordionContent>
              Yes. It comes with default styles that match the design system.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
      <section>
        <h2 className="mb-4 text-xl font-semibold">Collapsible</h2>
        <Collapsible
          open={collapsibleOpen}
          onOpenChange={onCollapsibleOpenChange}
          className="max-w-md"
        >
          <CollapsibleTrigger asChild>
            <Button variant="outline">
              {collapsibleOpen ? "Hide" : "Show"} content
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 rounded-md border p-4">
            <p>This content can be collapsed and expanded.</p>
          </CollapsibleContent>
        </Collapsible>
      </section>
      <section>
        <h2 className="mb-4 text-xl font-semibold">Separator</h2>
        <div className="max-w-md space-y-2">
          <p>Content above</p>
          <Separator />
          <p>Content below</p>
          <Separator orientation="vertical" className="h-8" />
        </div>
      </section>
      <section>
        <h2 className="mb-4 text-xl font-semibold">Table</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Alice</TableCell>
              <TableCell>
                <Badge>Active</Badge>
              </TableCell>
              <TableCell>Admin</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Bob</TableCell>
              <TableCell>
                <Badge variant="secondary">Pending</Badge>
              </TableCell>
              <TableCell>User</TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={2}>Total</TableCell>
              <TableCell>2 users</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </section>
      <section>
        <h2 className="mb-4 text-xl font-semibold">Pagination</h2>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </section>
      <section>
        <h2 className="mb-4 text-xl font-semibold">Carousel</h2>
        <Carousel className="mx-auto max-w-md">
          <CarouselContent>
            {[1, 2, 3].map((i) => (
              <CarouselItem key={i}>
                <div
                  className={cn(
                    "flex aspect-square items-center justify-center rounded-lg bg-muted text-muted-foreground"
                  )}
                >
                  Slide {i}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>
    </div>
  )
}
