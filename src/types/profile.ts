/** User profile API response */
export interface UserProfile {
  image_url?: string
  first_name: string
  last_name: string
  email: string
  phone_country_code: string
  phone: string
  bio: string
}

/** Payment method API response */
export interface PaymentMethod {
  id: string
  brand: "Visa" | "Mastercard" | "JCB" | "Amex"
  last4: string
  exp_month: number
  exp_year: number
  is_default?: boolean
}
