import { PageLayout } from "@/components/layouts/page-layout"
import { StaffEventCard } from "@/features/staff"
import { STAFF_EVENTS, STAFF_NAME } from "@/mocks/staff"
import { Link } from "@tanstack/react-router"

export default function StaffLandingPage() {
  const [current] = STAFF_EVENTS

  return (
    <PageLayout className="min-h-svh bg-muted/30">
      <main className="mx-auto flex max-w-[960px] flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row">
        <section className="min-w-0 flex-1 space-y-6">
          <header className="space-y-1">
            <h1 className="text-2xl font-semibold text-primary">Event Staff</h1>
            <p className="text-sm text-muted-foreground">{STAFF_NAME}</p>
          </header>

          {current && (
            <section className="space-y-3">
              <h2 className="text-base font-medium text-foreground">
                Now Event
              </h2>
              <Link to="/staff/scan" search={{ eventId: current.id }}>
                <StaffEventCard
                  key={current.id}
                  highlight
                  title={current.title}
                  dateRange={current.dateRange}
                  venue={current.venue}
                  imageUrl={current.imageUrl}
                  className="cursor-pointer"
                />
              </Link>
            </section>
          )}

          <section className="space-y-3">
            <h2 className="text-base font-medium text-foreground">All Event</h2>
            <div className="flex flex-col gap-3">
              {STAFF_EVENTS.map((event) => (
                <Link
                  key={event.id}
                  to="/staff/scan"
                  search={{ eventId: event.id }}
                >
                  <StaffEventCard
                    title={event.title}
                    dateRange={event.dateRange}
                    venue={event.venue}
                    imageUrl={event.imageUrl}
                    className="cursor-pointer"
                  />
                </Link>
              ))}
            </div>
          </section>
        </section>
      </main>
    </PageLayout>
  )
}
