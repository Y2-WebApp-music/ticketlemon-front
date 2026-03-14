export interface PurchaseOrderItem {
  title: string
  session_label: string
  price: string
  price_value: number
  qty: number
  line_total: number
}

/** Cart state passed from Choose Ticket page */
export interface PurchaseCartState {
  order_items: PurchaseOrderItem[]
  total: number
  total_tickets: number
}

export interface PurchaseFormPayload {
  payment_method: PaymentMethodId
  email: string
  phone: string
  phone_country_code: string
  accept_terms: boolean
}

export type PaymentMethodId = "card" | "cash" | "promptpay" | "truemoney"
