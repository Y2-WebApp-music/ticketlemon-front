import { useNavigate } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import TicketlemonFull from "@/assets/ticketlemon-full.svg?react"
import WaifuMascot from "@/assets/waifu_mascot_charac.jpeg"
import {
  RegisterStep1Form,
  RegisterStep2Form,
  SignInForm,
  type RegisterDataForm,
} from "@/features/auth"
import { DEFAULT_PHONE_REGION } from "@/constants/phone-region.constant"
import { signIn } from "@/services/authService"
import type { ErrorResponseProps } from "@/types/responseHandler"
import * as React from "react"

const initialDataForm: RegisterDataForm = {
  email: "",
  password: "",
  confirmPassword: "",
  firstName: "",
  lastName: "",
  phoneCountryCode: DEFAULT_PHONE_REGION.dialCode,
  phone: "",
  dateOfBirth: undefined,
  gender: "",
  subscribeNewsletter: false,
  acceptTerms: false,
}

export default function SignInPage() {
  const navigate = useNavigate()
  const [isRegister, setIsRegister] = React.useState(false)
  const [registerStep, setRegisterStep] = React.useState<1 | 2>(1)
  const [signInDataForm, setSignInDataForm] = React.useState<{
    email: string
    password: string
  }>({ email: "", password: "" })
  const [dataForm, setDataForm] = React.useState<RegisterDataForm>(
    initialDataForm
  )
  const [signInLoading, setSignInLoading] = React.useState(false)
  const [signInError, setSignInError] = React.useState<string | null>(null)

  const goToRegister = () => {
    setIsRegister(true)
    setRegisterStep(1)
  }
  const goToSignIn = () => {
    setIsRegister(false)
    setRegisterStep(1)
  }
  const goToRegisterStep2 = () => setRegisterStep(2)
  const goToRegisterStep1 = () => setRegisterStep(1)

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
                <RegisterStep2Form
                  idPrefix="mobile"
                  variant="mobile"
                  dataForm={dataForm}
                  onDataFormChange={setDataForm}
                  onBack={goToRegisterStep1}
                  onContinue={() => {
                    // TODO: complete registration
                  }}
                  onSignIn={goToSignIn}
                />
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
                onGoogleSignIn={() => {
                  // TODO: google sign in
                }}
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
            // TODO: event staff
          }}
        >
          Event Staff
        </Button>
      </div>

      {/* Desktop */}
      <div className="relative mx-auto hidden min-h-svh w-full grid-cols-2 lg:grid">
        <div className="relative overflow-hidden bg-background px-16 flex flex-col items-center justify-end">
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
              <div className="mx-auto flex w-full max-w-[360px] flex-col items-center gap-5">
                {isRegister ? (
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
                    <RegisterStep2Form
                      idPrefix="desktop"
                      variant="desktop"
                      dataForm={dataForm}
                      onDataFormChange={setDataForm}
                      onBack={goToRegisterStep1}
                      onContinue={() => {
                        // TODO: complete registration
                      }}
                      onSignIn={goToSignIn}
                    />
                  )
                ) : (
                  <SignInForm
                    idPrefix="desktop"
                    variant="desktop"
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
                    onGoogleSignIn={() => {
                      // TODO: google sign in
                    }}
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
                    // TODO: organizer site
                  }}
                >
                  Organizer Site
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
