import { PageLayout } from "@/components/layouts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MyTicketCard } from "@/features/my-ticket"
import { getTicketsByUserId } from "@/services/ticketService"
import { useUserStore } from "@/stores/user-store"
import type { MyTicketItem } from "@/types/my-ticket"
import dayjs from "dayjs"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"

export default function MyTicketsPage() {
  const userId = useUserStore((state) => state.user_id)
  const userName =
    useUserStore((state) => {
      const full = [state.first_name, state.last_name]
        .filter(Boolean)
        .join(" ")
        .trim()
      return full || state.email || "User"
    }) ?? "User"
  const [tickets, setTickets] = useState<MyTicketItem[]>([])

  useEffect(() => {
    const load = async () => {
      if (!userId) return
      try {
        const response = await getTicketsByUserId(userId)
        setTickets(response)
      } catch (error) {
        const message =
          typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Failed to load tickets"
        toast.error(message)
      }
    }

    load()
  }, [userId])

  const unpaid = useMemo(
    () => tickets.filter((t) => !t.is_purchased),
    [tickets]
  )
  const paid = useMemo(() => tickets.filter((t) => t.is_purchased), [tickets])
  const upcoming = useMemo(
    () => paid.filter((t) => dayjs(t.show_end_date).isAfter(dayjs())),
    [paid]
  )
  const history = useMemo(
    () => paid.filter((t) => !dayjs(t.show_end_date).isAfter(dayjs())),
    [paid]
  )

  return (
    <PageLayout>
      <div className="mx-auto max-w-[1336px] min-w-0 px-4 pt-6 pb-20 sm:px-6">
        {/* Header */}
        <div className="mb-10 space-y-0.5">
          <h1 className="text-2xl font-medium tracking-tight text-primary">
            My Ticket
          </h1>
          <p className="text-base text-muted-foreground">{userName}</p>
        </div>

        {/* Unpaid */}
        {unpaid.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-normal text-foreground">Unpaid</h2>
            <div className="flex flex-wrap gap-4">
              {unpaid.map((ticket, i) => (
                <MyTicketCard key={`unpaid-${i}`} {...ticket} />
              ))}
            </div>
          </section>
        )}

        {/* Your Ticket */}
        <section className="mt-10 space-y-4">
          <h2 className="text-xl font-normal text-foreground">Your Ticket</h2>
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="mt-0">
              <div className="grid gap-4 sm:grid-cols-2">
                {upcoming.map((ticket, i) => (
                  <MyTicketCard key={`paid-upcoming-${i}`} {...ticket} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="history" className="mt-0">
              <div className="grid gap-4 sm:grid-cols-2">
                {history.map((ticket, i) => (
                  <MyTicketCard key={`paid-history-${i}`} {...ticket} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </PageLayout>
  )
}
