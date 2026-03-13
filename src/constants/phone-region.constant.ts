export type PhoneRegionIso2 =
  | "TH"
  | "US"
  | "GB"
  | "CA"
  | "AU"
  | "NZ"
  | "SG"
  | "MY"
  | "VN"
  | "ID"
  | "PH"
  | "JP"
  | "KR"
  | "CN"
  | "HK"
  | "TW"
  | "IN"
  | "AE"
  | "SA"
  | "QA"
  | "DE"
  | "FR"
  | "ES"
  | "IT"
  | "NL"
  | "BE"
  | "CH"
  | "AT"
  | "SE"
  | "NO"
  | "DK"
  | "FI"

export interface PhoneRegion {
  /** ISO 3166-1 alpha-2 */
  iso2: PhoneRegionIso2
  /** Human-friendly name */
  name: string
  /** E.164 country calling code (e.g. "+66") */
  dialCode: `+${number}`
  /** Optional flag for UI labels */
  flag?: string
}

export const PHONE_REGIONS: readonly PhoneRegion[] = [
  { iso2: "TH", name: "Thailand", dialCode: "+66", flag: "🇹🇭" },
  { iso2: "US", name: "United States", dialCode: "+1", flag: "🇺🇸" },
  { iso2: "CA", name: "Canada", dialCode: "+1", flag: "🇨🇦" },
  { iso2: "GB", name: "United Kingdom", dialCode: "+44", flag: "🇬🇧" },
  { iso2: "AU", name: "Australia", dialCode: "+61", flag: "🇦🇺" },
  { iso2: "NZ", name: "New Zealand", dialCode: "+64", flag: "🇳🇿" },
  { iso2: "SG", name: "Singapore", dialCode: "+65", flag: "🇸🇬" },
  { iso2: "MY", name: "Malaysia", dialCode: "+60", flag: "🇲🇾" },
  { iso2: "VN", name: "Vietnam", dialCode: "+84", flag: "🇻🇳" },
  { iso2: "ID", name: "Indonesia", dialCode: "+62", flag: "🇮🇩" },
  { iso2: "PH", name: "Philippines", dialCode: "+63", flag: "🇵🇭" },
  { iso2: "JP", name: "Japan", dialCode: "+81", flag: "🇯🇵" },
  { iso2: "KR", name: "South Korea", dialCode: "+82", flag: "🇰🇷" },
  { iso2: "CN", name: "China", dialCode: "+86", flag: "🇨🇳" },
  { iso2: "HK", name: "Hong Kong", dialCode: "+852", flag: "🇭🇰" },
  { iso2: "TW", name: "Taiwan", dialCode: "+886", flag: "🇹🇼" },
  { iso2: "IN", name: "India", dialCode: "+91", flag: "🇮🇳" },
  { iso2: "AE", name: "United Arab Emirates", dialCode: "+971", flag: "🇦🇪" },
  { iso2: "SA", name: "Saudi Arabia", dialCode: "+966", flag: "🇸🇦" },
  { iso2: "QA", name: "Qatar", dialCode: "+974", flag: "🇶🇦" },
  { iso2: "DE", name: "Germany", dialCode: "+49", flag: "🇩🇪" },
  { iso2: "FR", name: "France", dialCode: "+33", flag: "🇫🇷" },
  { iso2: "ES", name: "Spain", dialCode: "+34", flag: "🇪🇸" },
  { iso2: "IT", name: "Italy", dialCode: "+39", flag: "🇮🇹" },
  { iso2: "NL", name: "Netherlands", dialCode: "+31", flag: "🇳🇱" },
  { iso2: "BE", name: "Belgium", dialCode: "+32", flag: "🇧🇪" },
  { iso2: "CH", name: "Switzerland", dialCode: "+41", flag: "🇨🇭" },
  { iso2: "AT", name: "Austria", dialCode: "+43", flag: "🇦🇹" },
  { iso2: "SE", name: "Sweden", dialCode: "+46", flag: "🇸🇪" },
  { iso2: "NO", name: "Norway", dialCode: "+47", flag: "🇳🇴" },
  { iso2: "DK", name: "Denmark", dialCode: "+45", flag: "🇩🇰" },
  { iso2: "FI", name: "Finland", dialCode: "+358", flag: "🇫🇮" },
] as const

export const DEFAULT_PHONE_REGION: PhoneRegion = PHONE_REGIONS[0]

export function normalizeDialCode(value: string): `+${number}` | null {
  const trimmed = value.trim()
  const normalized = trimmed.startsWith("+") ? trimmed : `+${trimmed}`
  return /^\+\d+$/.test(normalized) ? (normalized as `+${number}`) : null
}

export function getPhoneRegionByIso2(iso2: string): PhoneRegion | undefined {
  return PHONE_REGIONS.find((r) => r.iso2 === iso2)
}

export function getPhoneRegionByDialCode(
  dialCode: string
): PhoneRegion | undefined {
  const normalized = normalizeDialCode(dialCode)
  if (!normalized) return undefined
  return PHONE_REGIONS.find((r) => r.dialCode === normalized)
}

export function ensureDialCode(
  dialCode: string,
  fallback: PhoneRegion = DEFAULT_PHONE_REGION
): `+${number}` {
  return normalizeDialCode(dialCode) ?? fallback.dialCode
}

export function toE164(dialCode: string, nationalNumber: string): string {
  const dc = ensureDialCode(dialCode)
  const digits = nationalNumber.replace(/\D/g, "")
  return `${dc}${digits}`
}

export function formatPhoneRegionLabel(region: PhoneRegion): string {
  // Example: "🇹🇭 +66"
  return `${region.flag ? `${region.flag} ` : ""}${region.dialCode}`
}
