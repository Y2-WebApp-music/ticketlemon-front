export interface PurchaseOrderItem {
  title: string
  sessionLabel: string
  price: string
  priceValue: number
  qty: number
  lineTotal: number
}

/** Cart state passed from Choose Ticket page */
export interface PurchaseCartState {
  orderItems: PurchaseOrderItem[]
  total: number
  totalTickets: number
}

export type PaymentMethodId = "card" | "cash" | "promptpay" | "truemoney"
