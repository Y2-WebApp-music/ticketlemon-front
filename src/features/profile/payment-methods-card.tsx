import * as React from "react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { PaymentMethod } from "@/types/profile"

function brandLabel(brand: PaymentMethod["brand"]) {
  return brand
}

export function PaymentMethodsCard({
  initialMethods,
}: {
  initialMethods: PaymentMethod[]
}) {
  const [methods, setMethods] = React.useState<PaymentMethod[]>(initialMethods)

  const defaultId = methods.find((m) => m.isDefault)?.id ?? null

  const setDefault = (id: string) => {
    setMethods((prev) => prev.map((m) => ({ ...m, isDefault: m.id === id })))
    toast.success("Default payment method updated")
  }

  const remove = (id: string) => {
    setMethods((prev) => {
      const next = prev.filter((m) => m.id !== id)
      if (!next.length) return next
      if (!next.some((m) => m.isDefault)) {
        next[0] = { ...next[0], isDefault: true }
      }
      return next
    })
    toast.success("Payment method removed")
  }

  return (
    <Card className="border-border" size="sm">
      <CardHeader className="border-b border-border">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-lg">My payment method</CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => toast.info("Add payment method (TODO)")}
          >
            Add
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {methods.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            You don’t have any saved payment methods yet.
          </p>
        ) : (
          <div className="space-y-3">
            {methods.map((m, idx) => (
              <div key={m.id} className="space-y-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-foreground">
                        {brandLabel(m.brand)} •••• {m.last4}
                      </p>
                      {m.id === defaultId && (
                        <Badge variant="secondary">Default</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Exp {String(m.expMonth).padStart(2, "0")}/{m.expYear}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {m.id !== defaultId && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setDefault(m.id)}
                      >
                        Set default
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(m.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
                {idx !== methods.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
