import * as React from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { OrganizerRegisterFormPayload } from "@/types/auth"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function isValidEmail(value: string): boolean {
  return EMAIL_REGEX.test(value.trim())
}

export interface OrganizerRegisterFormProps {
  idPrefix: string
  onSignIn: () => void
  customerEmail?: string
  isExistingUser?: boolean
  onCreateOrganizer?: (payload: OrganizerRegisterFormPayload) => void
  variant?: "mobile" | "desktop"
}

export function OrganizerRegisterForm({
  idPrefix,
  onSignIn,
  customerEmail = "",
  isExistingUser = false,
  onCreateOrganizer,
  variant = "mobile",
}: OrganizerRegisterFormProps) {
  const [organizerName, setOrganizerName] = React.useState("")
  const [useSameEmailAsCustomerSite, setUseSameEmailAsCustomerSite] =
    React.useState(isExistingUser)
  const [organizerEmail, setOrganizerEmail] = React.useState(
    isExistingUser ? customerEmail.trim() : ""
  )
  const [password, setPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [subscribeNewsletter, setSubscribeNewsletter] = React.useState(false)
  const [acceptTerms, setAcceptTerms] = React.useState(false)

  React.useEffect(() => {
    if (isExistingUser && customerEmail.trim()) {
      setOrganizerEmail(customerEmail.trim())
      setUseSameEmailAsCustomerSite(true)
    }
  }, [customerEmail, isExistingUser])

  const [organizerNameError, setOrganizerNameError] = React.useState("")
  const [organizerEmailError, setOrganizerEmailError] = React.useState("")
  const [confirmPasswordError, setConfirmPasswordError] = React.useState("")

  const effectiveEmail = isExistingUser
    ? customerEmail.trim()
    : useSameEmailAsCustomerSite
      ? customerEmail.trim()
      : organizerEmail.trim()

  const canSubmit =
    organizerName.trim() !== "" &&
    isValidEmail(effectiveEmail) &&
    (isExistingUser ||
      (password.trim() !== "" && confirmPassword.trim() !== "")) &&
    acceptTerms

  const handleCreateOrganizer = () => {
    let hasError = false

    if (!organizerName.trim()) {
      setOrganizerNameError("Organizer name is required")
      hasError = true
    } else {
      setOrganizerNameError("")
    }

    if (!isValidEmail(effectiveEmail)) {
      setOrganizerEmailError("Please enter a valid email address")
      hasError = true
    } else {
      setOrganizerEmailError("")
    }

    if (!isExistingUser && password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match")
      hasError = true
    } else {
      setConfirmPasswordError("")
    }

    if (!hasError) {
      onCreateOrganizer?.({
        organizerName: organizerName.trim(),
        organizerEmail: effectiveEmail,
        ...(isExistingUser ? {} : { password }),
        subscribeNewsletter,
        acceptTerms,
        isExistingUser,
      })
    }
  }

  const headingClass =
    variant === "mobile"
      ? "text-2xl font-medium tracking-tight text-foreground/80"
      : "text-2xl font-medium tracking-tight text-foreground/80"
  const formSpacingClass = variant === "mobile" ? "space-y-4" : "space-y-7"
  const labelClass = variant === "mobile" ? "text-sm" : "text-base"
  const inputClass =
    variant === "mobile"
      ? "rounded-lg"
      : " text-base placeholder:text-muted-foreground/80"
  const checkboxLabelClass =
    variant === "mobile"
      ? "cursor-pointer text-sm font-normal"
      : "cursor-pointer text-sm font-normal"
  const termsClass =
    variant === "mobile"
      ? "pl-6 text-xs text-muted-foreground"
      : "pl-6 text-xs text-muted-foreground"
  const submitButtonClass = variant === "mobile" ? "w-full" : "mt-3 w-full"

  return (
    <>
      <h1 className={`w-full text-left ${headingClass}`}>
        {isExistingUser ? "Complete Organizer Profile" : "Create Organizer"}
      </h1>
      <div className={`w-full ${formSpacingClass}`}>
        <div className="space-y-2">
          <Label htmlFor={`org-name-${idPrefix}`} className={labelClass}>
            Organizer Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id={`org-name-${idPrefix}`}
            type="text"
            placeholder="Enter organizer name"
            value={organizerName}
            onChange={(e) => {
              setOrganizerName(e.target.value)
              if (organizerNameError) setOrganizerNameError("")
            }}
            className={inputClass}
            aria-invalid={!!organizerNameError}
            aria-describedby={
              organizerNameError ? `org-name-error-${idPrefix}` : undefined
            }
          />
          {organizerNameError && (
            <p
              id={`org-name-error-${idPrefix}`}
              className="text-sm text-destructive"
              role="alert"
            >
              {organizerNameError}
            </p>
          )}
        </div>

        {!isExistingUser && (
          <div className="flex items-center gap-2">
            <Checkbox
              id={`org-use-customer-email-${idPrefix}`}
              checked={useSameEmailAsCustomerSite}
              onCheckedChange={(checked) => {
                setUseSameEmailAsCustomerSite(checked === true)
                setOrganizerEmailError("")
              }}
            />
            <Label
              htmlFor={`org-use-customer-email-${idPrefix}`}
              className={checkboxLabelClass}
            >
              Use same email as Customer Site
            </Label>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor={`org-email-${idPrefix}`} className={labelClass}>
            Organizer Email <span className="text-destructive">*</span>
          </Label>
          <Input
            id={`org-email-${idPrefix}`}
            type="email"
            placeholder="Enter organizer email"
            value={
              isExistingUser || useSameEmailAsCustomerSite
                ? customerEmail
                : organizerEmail
            }
            disabled={isExistingUser || useSameEmailAsCustomerSite}
            onChange={(e) => {
              setOrganizerEmail(e.target.value)
              if (organizerEmailError) setOrganizerEmailError("")
            }}
            className={inputClass}
            aria-invalid={!!organizerEmailError}
            aria-describedby={
              organizerEmailError ? `org-email-error-${idPrefix}` : undefined
            }
          />
          {organizerEmailError && (
            <p
              id={`org-email-error-${idPrefix}`}
              className="text-sm text-destructive"
              role="alert"
            >
              {organizerEmailError}
            </p>
          )}
        </div>

        {!isExistingUser && (
          <>
            <div className="space-y-2">
              <Label
                htmlFor={`org-password-${idPrefix}`}
                className={labelClass}
              >
                Password <span className="text-destructive">*</span>
              </Label>
              <Input
                id={`org-password-${idPrefix}`}
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value.replace(/\s/g, ""))}
                className={inputClass}
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor={`org-confirm-password-${idPrefix}`}
                className={labelClass}
              >
                Confirm Password <span className="text-destructive">*</span>
              </Label>
              <Input
                id={`org-confirm-password-${idPrefix}`}
                type="password"
                placeholder="Enter confirm password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value.replace(/\s/g, ""))
                  if (confirmPasswordError) setConfirmPasswordError("")
                }}
                className={inputClass}
                aria-invalid={!!confirmPasswordError}
                aria-describedby={
                  confirmPasswordError
                    ? `org-confirm-password-error-${idPrefix}`
                    : undefined
                }
              />
              {confirmPasswordError && (
                <p
                  id={`org-confirm-password-error-${idPrefix}`}
                  className="text-sm text-destructive"
                  role="alert"
                >
                  {confirmPasswordError}
                </p>
              )}
            </div>
          </>
        )}

        <div className="flex items-center gap-2">
          <Checkbox
            id={`org-newsletter-${idPrefix}`}
            checked={subscribeNewsletter}
            onCheckedChange={(checked) =>
              setSubscribeNewsletter(checked === true)
            }
          />
          <Label
            htmlFor={`org-newsletter-${idPrefix}`}
            className={checkboxLabelClass}
          >
            Subscribe to Ticketlemon&apos;s newsletter
          </Label>
        </div>

        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <Checkbox
              id={`org-terms-${idPrefix}`}
              checked={acceptTerms}
              onCheckedChange={(checked) => setAcceptTerms(checked === true)}
              className="mt-0.5"
            />
            <Label
              htmlFor={`org-terms-${idPrefix}`}
              className={checkboxLabelClass}
            >
              Accept terms and condition
            </Label>
          </div>
          <Label htmlFor={`org-terms-${idPrefix}`} className={termsClass}>
            I agree that I have read and accepted Ticketlemon&apos;s{" "}
            <span className="text-primary underline underline-offset-2 hover:no-underline">
              Terms of Service
            </span>{" "}
            and{" "}
            <span className="text-primary underline underline-offset-2 hover:no-underline">
              Privacy Policy
            </span>
            .
          </Label>
        </div>

        <Button
          type="button"
          className={submitButtonClass}
          disabled={!canSubmit}
          onClick={handleCreateOrganizer}
        >
          {isExistingUser ? "Save Organizer Profile" : "Create Organizer"}
        </Button>

        {variant === "mobile" && (
          <div className="flex items-center justify-center gap-1 text-sm">
            <span className="text-foreground">Already have an account?</span>
            <button
              type="button"
              className="font-medium text-primary underline underline-offset-4"
              onClick={onSignIn}
            >
              Sign In
            </button>
          </div>
        )}
      </div>
    </>
  )
}
