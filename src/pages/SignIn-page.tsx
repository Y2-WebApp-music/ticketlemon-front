import TicketlemonFull from "@/assets/ticketlemon-full.svg?react"
import WaifuMascot from "@/assets/waifu_mascot_charac.jpeg"
import { Button } from "@/components/ui/button"
import {
  OrganizerRegisterForm,
  RegisterStep1Form,
  RegisterStep2Form,
  SignInForm,
  type RegisterDataForm,
} from "@/features/auth"
import { signIn, signUp } from "@/services/authService"
import { updateUser } from "@/services/staffService"
import { initialAuthDataForm } from "@/types/auth"
import type { ErrorResponseProps } from "@/types/responseHandler"
import { useNavigate } from "@tanstack/react-router"
import * as React from "react"
import type { OrganizerRegisterFormPayload } from "@/types/auth"

export default function SignInPage() {
  const navigate = useNavigate()
  const [isRegister, setIsRegister] = React.useState(false)
  const [isOrganizerSignIn, setIsOrganizerSignIn] = React.useState(false)
  const [isOrganizerRegister, setIsOrganizerRegister] = React.useState(false)
  const [registerStep, setRegisterStep] = React.useState<1 | 2>(1)
  const [signInDataForm, setSignInDataForm] = React.useState<{
    email: string
    password: string
  }>({ email: "", password: "" })
  const [dataForm, setDataForm] =
    React.useState<RegisterDataForm>(initialAuthDataForm)
  const [signInLoading, setSignInLoading] = React.useState(false)
  const [signInError, setSignInError] = React.useState<string | null>(null)
  const [signUpLoading, setSignUpLoading] = React.useState(false)
  const [signUpError, setSignUpError] = React.useState<string | null>(null)
  const [organizerSignUpLoading, setOrganizerSignUpLoading] =
    React.useState(false)
  const [organizerSignUpError, setOrganizerSignUpError] = React.useState<
    string | null
  >(null)

  const goToRegister = () => {
    if (isOrganizerSignIn) {
      setIsOrganizerRegister(true)
      return
    }
    setIsRegister(true)
    setRegisterStep(1)
  }
  const goToSignIn = () => {
    setIsRegister(false)
    setIsOrganizerRegister(false)
    setRegisterStep(1)
  }
  const goToRegisterStep2 = () => setRegisterStep(2)
  const goToRegisterStep1 = () => setRegisterStep(1)

  const handleOrganizerSignUp = async (
    payload: OrganizerRegisterFormPayload
  ) => {
    setOrganizerSignUpError(null)
    setOrganizerSignUpLoading(true)
    try {
      const email = payload.organizerEmail.trim()
      const password = payload.password

      const signInPayload = await signIn({ email, password })
      setSignInDataForm({ email, password })

      await updateUser(signInPayload.user_id, {
        org_name: payload.organizerName.trim(),
        role: "organizer",
      })

      navigate({ to: "/organizer" })
    } catch (err) {
      const message =
        err && typeof err === "object" && "message" in err
          ? String((err as ErrorResponseProps).message)
          : "Create organizer failed. Please try again."
      setOrganizerSignUpError(message)
    } finally {
      setOrganizerSignUpLoading(false)
    }
  }

  const handleSignUp = async () => {
    setSignUpError(null)
    setSignUpLoading(true)
    try {
      const email = dataForm.email.trim()
      const password = dataForm.password

      await signUp({
        email,
        password,
        first_name: dataForm.firstName.trim(),
        last_name: dataForm.lastName.trim(),
        phone_number:
          dataForm.phone.trim() !== ""
            ? `${dataForm.phoneCountryCode}${dataForm.phone}`
            : "",
        birthdate: dataForm.dateOfBirth
          ? dataForm.dateOfBirth.toISOString()
          : "",
        gender: dataForm.gender,
      })

      // Prefill sign-in data either way
      setSignInDataForm({ email, password })

      // Best effort: auto sign-in after successful registration
      try {
        const payload = await signIn({ email, password })
        if (payload.role === "organizer" || payload.role === "admin") {
          navigate({ to: "/organizer" })
        } else if (payload.role === "staff") {
          navigate({ to: "/staff-sign-in" })
        } else {
          navigate({ to: "/" })
        }
        return
      } catch {
        // Fall back to sign-in screen if auto sign-in fails
      }

      goToSignIn()
    } catch (err) {
      const message =
        err && typeof err === "object" && "message" in err
          ? String((err as ErrorResponseProps).message)
          : "Sign up failed. Please try again."
      setSignUpError(message)
    } finally {
      setSignUpLoading(false)
    }
  }

  const handleSignIn = async () => {
    setSignInError(null)
    setSignInLoading(true)
    try {
      const payload = await signIn({
        email: signInDataForm.email,
        password: signInDataForm.password,
      })
      if (payload.role === "organizer" || payload.role === "admin") {
        navigate({ to: "/organizer" })
      } else if (payload.role === "staff") {
        navigate({ to: "/staff-sign-in" })
      } else {
        navigate({ to: "/" })
      }
    } catch (err) {
      const message =
        err && typeof err === "object" && "message" in err
          ? String((err as ErrorResponseProps).message)
          : "Sign in failed. Please try again."
      setSignInError(message)
    } finally {
      setSignInLoading(false)
    }
  }

  return (
    <div className="min-h-svh bg-background">
      {/* Mobile */}
      <div className="mx-auto flex min-h-svh w-full max-w-[402px] flex-col items-center px-6 pt-16 pb-10 lg:hidden">
        <TicketlemonFull className="h-10 w-auto" aria-label="ticketlemon" />

        <div className="mt-8 w-full rounded-lg bg-card p-5">
          <div className="mx-auto flex w-full max-w-[300px] flex-col items-center gap-5">
            {isRegister ? (
              registerStep === 1 ? (
                <RegisterStep1Form
                  idPrefix="mobile"
                  variant="mobile"
                  dataForm={dataForm}
                  onDataFormChange={setDataForm}
                  onContinue={goToRegisterStep2}
                  onSignIn={goToSignIn}
                />
              ) : (
                <>
                  {signUpError && (
                    <p className="-mt-2 w-full text-sm text-destructive">
                      {signUpError}
                    </p>
                  )}
                  <RegisterStep2Form
                    idPrefix="mobile"
                    variant="mobile"
                    dataForm={dataForm}
                    onDataFormChange={setDataForm}
                    onBack={goToRegisterStep1}
                    onContinue={() => {
                      if (!signUpLoading) handleSignUp()
                    }}
                    onSignIn={goToSignIn}
                  />
                </>
              )
            ) : (
              <SignInForm
                idPrefix="mobile"
                variant="mobile"
                email={signInDataForm.email}
                password={signInDataForm.password}
                onEmailChange={(value) => {
                  setSignInDataForm((prev) => ({ ...prev, email: value }))
                  setSignInError(null)
                }}
                onPasswordChange={(value) => {
                  setSignInDataForm((prev) => ({ ...prev, password: value }))
                  setSignInError(null)
                }}
                onSignIn={handleSignIn}
                signInLoading={signInLoading}
                signInError={signInError}
                showGoogleSignIn={false}
                onGoogleSignIn={() => {}}
                onForgotPassword={() => {
                  // TODO: forgot password flow
                }}
                onRegister={goToRegister}
              />
            )}
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="mt-8 border-orange-200 text-orange-600 hover:bg-orange-50/50"
          onClick={() => {
            navigate({ to: "/staff-sign-in" })
          }}
        >
          Event Staff
        </Button>
      </div>

      {/* Desktop */}
      <div className="relative mx-auto hidden min-h-svh w-full grid-cols-2 lg:grid">
        <div className="relative flex flex-col items-center justify-end overflow-hidden bg-background px-16">
          <TicketlemonFull className="h-14 w-auto" aria-label="ticketlemon" />

          <div className="mt-16 w-[60%]">
            <img
              src={WaifuMascot}
              alt="Cute anime mascot"
              className="h-auto w-full"
              loading="lazy"
            />
          </div>
        </div>

        <div className="relative bg-primary">
          <div className="mx-auto flex min-h-full w-full max-w-[756px] items-center justify-center px-6 py-10">
            <div className="w-full max-w-[653px] rounded-xl border border-border bg-card px-10 py-10 shadow-xs">
              <div
                className={`mx-auto flex w-full flex-col items-center gap-5 ${
                  isOrganizerSignIn && isOrganizerRegister
                    ? "max-w-[620px]"
                    : "max-w-[360px]"
                }`}
              >
                {isOrganizerSignIn && isOrganizerRegister ? (
                  <>
                    {organizerSignUpError && (
                      <p className="-mt-2 w-full text-sm text-destructive">
                        {organizerSignUpError}
                      </p>
                    )}
                    <OrganizerRegisterForm
                      idPrefix="desktop"
                      variant="desktop"
                      customerEmail={signInDataForm.email}
                      onSignIn={goToSignIn}
                      onCreateOrganizer={(payload) => {
                        if (!organizerSignUpLoading) {
                          handleOrganizerSignUp(payload)
                        }
                      }}
                    />
                  </>
                ) : isRegister ? (
                  registerStep === 1 ? (
                    <RegisterStep1Form
                      idPrefix="desktop"
                      variant="desktop"
                      dataForm={dataForm}
                      onDataFormChange={setDataForm}
                      onContinue={goToRegisterStep2}
                      onSignIn={goToSignIn}
                    />
                  ) : (
                    <>
                      {signUpError && (
                        <p className="-mt-2 w-full text-sm text-destructive">
                          {signUpError}
                        </p>
                      )}
                      <RegisterStep2Form
                        idPrefix="desktop"
                        variant="desktop"
                        dataForm={dataForm}
                        onDataFormChange={setDataForm}
                        onBack={goToRegisterStep1}
                        onContinue={() => {
                          if (!signUpLoading) handleSignUp()
                        }}
                        onSignIn={goToSignIn}
                      />
                    </>
                  )
                ) : (
                  <SignInForm
                    idPrefix="desktop"
                    variant="desktop"
                    title={isOrganizerSignIn ? "Organizer Sign In" : "Sign In"}
                    email={signInDataForm.email}
                    password={signInDataForm.password}
                    onEmailChange={(value) => {
                      setSignInDataForm((prev) => ({ ...prev, email: value }))
                      setSignInError(null)
                    }}
                    onPasswordChange={(value) => {
                      setSignInDataForm((prev) => ({
                        ...prev,
                        password: value,
                      }))
                      setSignInError(null)
                    }}
                    onSignIn={handleSignIn}
                    signInLoading={signInLoading}
                    signInError={signInError}
                    showGoogleSignIn={false}
                    onGoogleSignIn={() => {}}
                    onForgotPassword={() => {
                      // TODO: forgot password flow
                    }}
                    onRegister={goToRegister}
                  />
                )}
              </div>

              <div className="mt-12 flex justify-center">
                <Button
                  type="button"
                  variant="outline"
                  className="border-orange-200 text-orange-600 hover:bg-orange-50/50"
                  onClick={() => {
                    setIsOrganizerSignIn((prev) => {
                      const next = !prev
                      setIsOrganizerRegister(false)
                      setIsRegister(false)
                      setRegisterStep(1)
                      return next
                    })
                  }}
                >
                  {isOrganizerSignIn ? "Audience Site" : "Organizer Site"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
