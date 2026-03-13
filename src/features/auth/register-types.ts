export interface RegisterStep1DataForm {
  email: string
  password: string
  confirmPassword: string
}

export interface RegisterStep2DataForm {
  firstName: string
  lastName: string
  phoneCountryCode: string
  phone: string
  dateOfBirth: Date | undefined
  gender: string
  subscribeNewsletter: boolean
  acceptTerms: boolean
}

export type RegisterDataForm = RegisterStep1DataForm & RegisterStep2DataForm
