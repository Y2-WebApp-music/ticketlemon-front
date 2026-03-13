import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { RegisterDataForm } from "./register-types"

export type { RegisterStep1DataForm } from "./register-types"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function isValidEmail(value: string): boolean {
  return EMAIL_REGEX.test(value.trim())
}

export interface RegisterStep1FormProps {
  idPrefix: string
  dataForm: RegisterDataForm
  onDataFormChange: React.Dispatch<React.SetStateAction<RegisterDataForm>>
  onContinue: () => void
  onSignIn: () => void
  variant?: "mobile" | "desktop"
}

export function RegisterStep1Form({
  idPrefix,
  dataForm,
  onDataFormChange,
  onContinue,
  onSignIn,
  variant = "mobile",
}: RegisterStep1FormProps) {
  const { email, password, confirmPassword } = dataForm
  const [emailError, setEmailError] = React.useState("")
  const [confirmPasswordError, setConfirmPasswordError] = React.useState("")

  const canContinue =
    email.trim() !== "" &&
    password.trim() !== "" &&
    confirmPassword.trim() !== ""

  const handleContinue = () => {
    let hasError = false

    if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address")
      hasError = true
    } else {
      setEmailError("")
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match")
      hasError = true
    } else {
      setConfirmPasswordError("")
    }

    if (!hasError) {
      onContinue()
    }
  }

  const headingClass =
    variant === "mobile"
      ? "text-2xl font-medium tracking-tight text-foreground/80"
      : "text-3xl font-medium tracking-tight text-foreground/80"

  return (
    <>
      <h1 className={`w-full text-left ${headingClass}`}>
        Create an account
      </h1>
      <div className="w-full space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`reg-email-${idPrefix}`} className="text-sm">
            Email <span className="text-destructive">*</span>
          </Label>
          <Input
            id={`reg-email-${idPrefix}`}
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => {
              onDataFormChange((prev) => ({ ...prev, email: e.target.value }))
              if (emailError) setEmailError("")
            }}
            className="rounded-lg"
            aria-invalid={!!emailError}
            aria-describedby={
              emailError ? `reg-email-error-${idPrefix}` : undefined
            }
          />
          {emailError && (
            <p
              id={`reg-email-error-${idPrefix}`}
              className="text-sm text-destructive"
              role="alert"
            >
              {emailError}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor={`reg-password-${idPrefix}`} className="text-sm">
            Password <span className="text-destructive">*</span>
          </Label>
          <Input
            id={`reg-password-${idPrefix}`}
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => {
              const value = e.target.value.replace(/\s/g, "")
              onDataFormChange((prev) => ({ ...prev, password: value }))
              if (confirmPasswordError) setConfirmPasswordError("")
            }}
            className="rounded-lg"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`reg-confirm-${idPrefix}`} className="text-sm">
            Confirm Password <span className="text-destructive">*</span>
          </Label>
          <Input
            id={`reg-confirm-${idPrefix}`}
            type="password"
            placeholder="Enter confirm password"
            value={confirmPassword}
            onChange={(e) => {
              const value = e.target.value.replace(/\s/g, "")
              onDataFormChange((prev) => ({
                ...prev,
                confirmPassword: value,
              }))
              if (confirmPasswordError) setConfirmPasswordError("")
            }}
            className="rounded-lg"
            aria-invalid={!!confirmPasswordError}
            aria-describedby={
              confirmPasswordError ? `reg-confirm-error-${idPrefix}` : undefined
            }
          />
          {confirmPasswordError && (
            <p
              id={`reg-confirm-error-${idPrefix}`}
              className="text-sm text-destructive"
              role="alert"
            >
              {confirmPasswordError}
            </p>
          )}
        </div>
        <Button
          type="button"
          className="w-full rounded-lg"
          onClick={handleContinue}
          disabled={!canContinue}
        >
          Continue
        </Button>
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
      </div>
    </>
  )
}
