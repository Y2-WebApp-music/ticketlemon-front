export function PurchaseImportant() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="text-base font-medium text-foreground">Important</h3>
      <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-muted-foreground">
        <li>
          Your order will be canceled if payment is not completed within the
          specified time.
        </li>
        <li>
          You will receive your confirmation email within 2 hours after payment.
          If you do not receive this email, please contact billing@ticketlemon.com
          along with your proof of payment.
        </li>
      </ul>
    </div>
  )
}
