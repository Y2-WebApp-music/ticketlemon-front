import type { UserProfile, PaymentMethod } from "@/types/profile"

export const userProfileMock: UserProfile = {
  image_url: "",
  first_name: "Nut",
  last_name: "Somwang",
  email: "nut@example.com",
  phone_country_code: "+66",
  phone: "",
  bio: "",
}

export const paymentMethodsMock: PaymentMethod[] = [
  {
    id: "pm_1",
    brand: "Visa",
    last4: "4242",
    exp_month: 12,
    exp_year: 2028,
    is_default: true,
  },
  {
    id: "pm_2",
    brand: "Mastercard",
    last4: "4444",
    exp_month: 6,
    exp_year: 2027,
  },
]
