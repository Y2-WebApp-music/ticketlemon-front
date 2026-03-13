import * as React from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  DEFAULT_PHONE_REGION,
  PHONE_REGIONS,
  ensureDialCode,
  formatPhoneRegionLabel,
} from "@/constants/phone-region.constant"
import { cn } from "@/lib/utils"

export interface ProfileFormValues {
  imageUrl?: string
  firstName: string
  lastName: string
  email: string
  phoneCountryCode: string
  phone: string
  bio: string
}

export interface ProfileFormProps {
  initialValues: ProfileFormValues
}

export function ProfileForm({ initialValues }: ProfileFormProps) {
  const [values, setValues] = React.useState<ProfileFormValues>(initialValues)
  const [saving, setSaving] = React.useState(false)

  const firstNameTrim = values.firstName.trim()
  const lastNameTrim = values.lastName.trim()
  const emailTrim = values.email.trim()
  const phoneTrim = values.phone.trim()

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrim)
  const phoneOk = phoneTrim.length === 0 ? true : /^\d{1,13}$/.test(phoneTrim)

  const firstNameError =
    firstNameTrim.length === 0 ? "First name is required." : undefined
  const lastNameError =
    lastNameTrim.length === 0 ? "Last name is required." : undefined
  const emailError =
    emailTrim.length === 0
      ? "Email is required."
      : emailOk
        ? undefined
        : "Enter a valid email."
  const phoneError = phoneOk
    ? undefined
    : "Phone number must be digits only (max 13)."

  const canSave = !firstNameError && !lastNameError && !emailError && !phoneError

  const update = <K extends keyof ProfileFormValues>(
    key: K,
    value: ProfileFormValues[K]
  ) => setValues((prev) => ({ ...prev, [key]: value }))

  const fileInputId = "profile-image"
  const safeDialCode = ensureDialCode(values.phoneCountryCode, DEFAULT_PHONE_REGION)

  return (
    <Card className="border-border" size="sm">
      <CardHeader className="border-b border-border">
        <CardTitle className="text-lg">My Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Profile image */}
        <div className="flex items-center gap-4">
          <div className="relative size-16 overflow-hidden rounded-full border border-border bg-muted">
            {values.imageUrl ? (
              <img
                src={values.imageUrl}
                alt=""
                className="size-full object-cover"
              />
            ) : (
              <div className="grid size-full place-items-center text-xs font-medium text-muted-foreground">
                No photo
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <input
              id={fileInputId}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (!file) return
                const reader = new FileReader()
                reader.onload = () => {
                  update("imageUrl", String(reader.result ?? ""))
                }
                reader.readAsDataURL(file)
              }}
            />
            <Button asChild variant="outline" size="sm">
              <label htmlFor={fileInputId} className="cursor-pointer">
                {values.imageUrl ? "Change photo" : "Upload photo"}
              </label>
            </Button>
            {values.imageUrl && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => update("imageUrl", "")}
              >
                Remove
              </Button>
            )}
            <p className="w-full text-xs text-muted-foreground sm:w-auto">
              JPG/PNG, max ~2MB recommended.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="profile-firstname">
              First name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="profile-firstname"
              value={values.firstName}
              onChange={(e) => update("firstName", e.target.value)}
              placeholder="First name"
              required
              aria-invalid={firstNameError ? true : undefined}
            />
            {firstNameError && (
              <p className="text-sm text-destructive">{firstNameError}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile-lastname">
              Last name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="profile-lastname"
              value={values.lastName}
              onChange={(e) => update("lastName", e.target.value)}
              placeholder="Last name"
              required
              aria-invalid={lastNameError ? true : undefined}
            />
            {lastNameError && (
              <p className="text-sm text-destructive">{lastNameError}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="profile-email">
            Email <span className="text-destructive">*</span>
          </Label>
          <Input
            id="profile-email"
            type="email"
            value={values.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="Email"
            required
            aria-invalid={emailError ? true : undefined}
          />
          {emailError && (
            <p className="text-sm text-destructive">{emailError}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="profile-phone">Phone number</Label>
          <InputGroup className="w-full">
            <InputGroupAddon align="inline-start" className="px-1.5">
              <Select
                value={safeDialCode}
                onValueChange={(v) => update("phoneCountryCode", v)}
              >
                <SelectTrigger
                  size="sm"
                  className="h-7 border-0 bg-transparent py-0 pr-1 pl-1.5 shadow-none focus-visible:ring-0"
                  aria-label="Country code"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PHONE_REGIONS.map((r) => (
                    <SelectItem key={r.iso2} value={r.dialCode}>
                      {formatPhoneRegionLabel(r)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </InputGroupAddon>
            <InputGroupInput
              id="profile-phone"
              type="tel"
              placeholder="Please enter phone number"
              value={values.phone}
              inputMode="numeric"
              pattern="\d*"
              onChange={(e) => {
                const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 13)
                update("phone", digitsOnly)
              }}
              aria-invalid={phoneError ? true : undefined}
              className="pl-1"
            />
          </InputGroup>
          {phoneError && (
            <p className="text-sm text-destructive">{phoneError}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="profile-bio">Bio</Label>
          <Textarea
            id="profile-bio"
            placeholder="Tell us a bit about yourself"
            value={values.bio}
            onChange={(e) => update("bio", e.target.value)}
            className="min-h-24"
          />
        </div>
      </CardContent>
      <CardFooter className="border-t border-border justify-end">
        <Button
          type="button"
          disabled={!canSave || saving}
          className={cn(saving && "pointer-events-none")}
          onClick={async () => {
            setSaving(true)
            try {
              // Placeholder for API call
              await new Promise((r) => setTimeout(r, 500))
              toast.success("Profile updated")
            } finally {
              setSaving(false)
            }
          }}
        >
          {saving ? "Saving..." : "Save changes"}
        </Button>
      </CardFooter>
    </Card>
  )
}

