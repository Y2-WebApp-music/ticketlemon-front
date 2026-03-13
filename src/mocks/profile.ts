import type { UserProfile, PaymentMethod } from "@/types/profile"

export const userProfileMock: UserProfile = {
  imageUrl: "",
  firstName: "Nut",
  lastName: "Somwang",
  email: "nut@example.com",
  phoneCountryCode: "+66",
  phone: "",
  bio: "",
}

export const paymentMethodsMock: PaymentMethod[] = [
  {
    id: "pm_1",
    brand: "Visa",
    last4: "4242",
    expMonth: 12,
    expYear: 2028,
    isDefault: true,
  },
  {
    id: "pm_2",
    brand: "Mastercard",
    last4: "4444",
    expMonth: 6,
    expYear: 2027,
  },
]

