import { PageLayout } from "@/components/layouts"
import { MyTicketCard } from "@/features/my-ticket"
import {
  myTicketsUserName,
  paidTickets,
  unpaidTickets,
} from "@/mocks/my-tickets"

export default function MyTicketsPage() {
  return (
    <PageLayout>
      <div className="mx-auto max-w-[1336px] min-w-0 px-4 pt-6 pb-20 sm:px-6">
        {/* Header */}
        <div className="mb-10 space-y-0.5">
          <h1 className="text-2xl font-medium tracking-tight text-primary">
            My Ticket
          </h1>
          <p className="text-base text-muted-foreground">{myTicketsUserName}</p>
        </div>

        {/* Unpaid */}
        {unpaidTickets.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-normal text-foreground">Unpaid</h2>
            <div className="flex flex-wrap gap-4">
              {unpaidTickets.map((ticket, i) => (
                <MyTicketCard key={`unpaid-${i}`} {...ticket} />
              ))}
            </div>
          </section>
        )}

        {/* Your Ticket */}
        <section className="mt-10 space-y-4">
          <h2 className="text-xl font-normal text-foreground">Your Ticket</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {paidTickets.map((ticket, i) => (
              <MyTicketCard key={`paid-${i}`} {...ticket} />
            ))}
          </div>
        </section>
      </div>
    </PageLayout>
  )
}
