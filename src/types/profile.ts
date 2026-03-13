/** User profile API response */
export interface UserProfile {
  imageUrl?: string
  firstName: string
  lastName: string
  email: string
  phoneCountryCode: string
  phone: string
  bio: string
}

/** Payment method API response */
export interface PaymentMethod {
  id: string
  brand: "Visa" | "Mastercard" | "JCB" | "Amex"
  last4: string
  expMonth: number
  expYear: number
  isDefault?: boolean
}
