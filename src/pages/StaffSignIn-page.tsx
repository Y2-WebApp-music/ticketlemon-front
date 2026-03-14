import TicketlemonFull from "@/assets/ticketlemon-full.svg?react"
import { Button } from "@/components/ui/button"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Link, useNavigate } from "@tanstack/react-router"
import { ChevronLeft } from "lucide-react"
import * as React from "react"

export default function StaffSignInPage() {
  const navigate = useNavigate()
  const [staffCode, setStaffCode] = React.useState("")

  const canSubmit = staffCode.length === 6

  return (
    <div className="min-h-svh bg-background">
      <main className="mx-auto w-full max-w-[402px] px-5 py-10">
        <div className="flex justify-center pt-20">
          <TicketlemonFull className="h-10 w-auto" aria-label="ticketlemon" />
        </div>

        <Link
          to="/sign-in"
          className="mt-14 inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-primary hover:bg-muted"
        >
          <ChevronLeft className="size-4" />
          Back
        </Link>

        <section className="mt-12 flex flex-col items-center">
          <h1 className="text-xl font-medium tracking-tight text-foreground">
            Enter Staf Code
          </h1>

          <InputOTP
            maxLength={6}
            value={staffCode}
            onChange={(value) => setStaffCode(value)}
            containerClassName="mt-5"
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} className="size-[50px] text-base" />
              <InputOTPSlot index={1} className="size-[50px] text-base" />
              <InputOTPSlot index={2} className="size-[50px] text-base" />
              <InputOTPSlot index={3} className="size-[50px] text-base" />
              <InputOTPSlot index={4} className="size-[50px] text-base" />
              <InputOTPSlot index={5} className="size-[50px] text-base" />
            </InputOTPGroup>
          </InputOTP>

          <Button
            type="button"
            size="lg"
            className="mt-10 px-5 text-base"
            disabled={!canSubmit}
            onClick={() => navigate({ to: "/staff" })}
          >
            Sign In
          </Button>
        </section>
      </main>
    </div>
  )
}
