import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import GoogleFaviconUrl from "@/assets/Google_Favicon_2025.svg"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function isValidEmail(value: string): boolean {
  return EMAIL_REGEX.test(value.trim())
}

export interface SignInFormProps {
  idPrefix: string
  email: string
  password: string
  onEmailChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onSignIn: () => void
  onGoogleSignIn: () => void
  onForgotPassword: () => void
  onRegister: () => void
  /** "mobile" = smaller heading (text-2xl), "desktop" = larger (text-3xl) */
  variant?: "mobile" | "desktop"
  signInLoading?: boolean
  signInError?: string | null
}

export function SignInForm({
  idPrefix,
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onSignIn,
  onGoogleSignIn,
  onForgotPassword,
  onRegister,
  variant = "mobile",
  signInLoading = false,
  signInError = null,
}: SignInFormProps) {
  const [emailError, setEmailError] = React.useState("")
  const [passwordError, setPasswordError] = React.useState("")

  const handleSignIn = () => {
    let hasError = false

    const trimmedEmail = email.trim()
    if (!trimmedEmail) {
      setEmailError("Email is required")
      hasError = true
    } else if (!isValidEmail(trimmedEmail)) {
      setEmailError("Please enter a valid email address")
      hasError = true
    } else {
      setEmailError("")
    }

    if (!password) {
      setPasswordError("Password is required")
      hasError = true
    } else {
      setPasswordError("")
    }

    if (!hasError) {
      onSignIn()
    }
  }

  const headingClass =
    variant === "mobile"
      ? "text-2xl font-medium tracking-tight text-foreground/80"
      : "text-3xl font-medium tracking-tight text-foreground/80"

  return (
    <>
      <h1 className={`w-full text-left ${headingClass}`}>Sign In</h1>
      {signInError && (
        <p className="w-full text-sm text-destructive" role="alert">
          {signInError}
        </p>
      )}
      {variant === "desktop" && (
        <>
          <Button
            type="button"
            variant="outline"
            onClick={onGoogleSignIn}
            className="w-full"
          >
            <span className="mr-2 inline-flex size-5 items-center justify-center">
              <img
                src={GoogleFaviconUrl}
                alt=""
                className="size-5"
                aria-hidden
              />
            </span>
            Sign In With Google
          </Button>
          <div className="flex w-full items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-sm font-medium text-muted-foreground">
              OR
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>
        </>
      )}
      <div className="w-full space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`signin-email-${idPrefix}`} className="text-sm">
            Email
          </Label>
          <Input
            id={`signin-email-${idPrefix}`}
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              onEmailChange(e.target.value)
              if (emailError) setEmailError("")
            }}
            className="rounded-lg"
            aria-invalid={!!emailError}
            aria-describedby={emailError ? `signin-email-error-${idPrefix}` : undefined}
          />
          {emailError && (
            <p
              id={`signin-email-error-${idPrefix}`}
              className="text-sm text-destructive"
              role="alert"
            >
              {emailError}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor={`signin-password-${idPrefix}`} className="text-sm">
            Password
          </Label>
          <Input
            id={`signin-password-${idPrefix}`}
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => {
              const value = e.target.value.replace(/\s/g, "")
              onPasswordChange(value)
              if (passwordError) setPasswordError("")
            }}
            className="rounded-lg"
            aria-invalid={!!passwordError}
            aria-describedby={passwordError ? `signin-password-error-${idPrefix}` : undefined}
          />
          {passwordError && (
            <p
              id={`signin-password-error-${idPrefix}`}
              className="text-sm text-destructive"
              role="alert"
            >
              {passwordError}
            </p>
          )}
          <div className="text-right">
            <button
              type="button"
              className="text-xs text-foreground/70 hover:underline"
              onClick={onForgotPassword}
            >
              Forget your Password?
            </button>
          </div>
        </div>
        <Button
          type="button"
          className="w-full rounded-lg"
          onClick={handleSignIn}
          disabled={signInLoading}
        >
          {signInLoading ? "Signing in…" : "Sign In"}
        </Button>
        {variant === "mobile" && (
          <>
            <div className="flex w-full items-center gap-3 pt-2">
              <div className="h-px flex-1 bg-border" />
              <span className="text-sm font-medium text-muted-foreground">
                OR
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="w-full flex justify-center">
              <Button
                type="button"
                variant="outline"
                onClick={onGoogleSignIn}
              >
                <span className="mr-2 inline-flex size-5 items-center justify-center">
                  <img
                    src={GoogleFaviconUrl}
                    alt=""
                    className="size-5"
                    aria-hidden
                  />
                </span>
                Sign In With Google
              </Button>
            </div>
          </>
        )}
        <div className="flex items-center justify-center gap-1 text-sm">
          <span className="text-foreground">Don&apos;t have an account?</span>
          <button
            type="button"
            className="font-medium text-primary underline underline-offset-4"
            onClick={onRegister}
          >
            Register here !
          </button>
        </div>
      </div>
    </>
  )
}
