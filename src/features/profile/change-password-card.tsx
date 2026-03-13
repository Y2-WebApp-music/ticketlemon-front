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
import { Label } from "@/components/ui/label"

export function ChangePasswordCard() {
  const [currentPassword, setCurrentPassword] = React.useState("")
  const [newPassword, setNewPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [saving, setSaving] = React.useState(false)

  const currentOk = currentPassword.trim().length > 0
  const newOk = newPassword.length >= 8
  const confirmOk =
    confirmPassword.length > 0 && confirmPassword === newPassword

  const currentError = currentOk ? undefined : "Current password is required."
  const newError = newOk
    ? undefined
    : "New password must be at least 8 characters."
  const confirmError =
    confirmPassword.length === 0
      ? "Confirm password is required."
      : confirmOk
        ? undefined
        : "Passwords do not match."

  const canSave = currentOk && newOk && confirmOk

  return (
    <Card className="border-border" size="sm">
      <CardHeader className="border-b border-border">
        <CardTitle className="text-lg">Change password</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="profile-current-password">
            Current password <span className="text-destructive">*</span>
          </Label>
          <Input
            id="profile-current-password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Current password"
            required
            aria-invalid={currentError ? true : undefined}
          />
          {currentError && (
            <p className="text-sm text-destructive">{currentError}</p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="profile-new-password">
              New password <span className="text-destructive">*</span>
            </Label>
            <Input
              id="profile-new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password"
              required
              aria-invalid={newError ? true : undefined}
            />
            {newError && <p className="text-sm text-destructive">{newError}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile-confirm-password">
              Confirm password <span className="text-destructive">*</span>
            </Label>
            <Input
              id="profile-confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              required
              aria-invalid={confirmError ? true : undefined}
            />
            {confirmError && (
              <p className="text-sm text-destructive">{confirmError}</p>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-end border-t border-border">
        <Button
          type="button"
          disabled={!canSave || saving}
          onClick={async () => {
            setSaving(true)
            try {
              // Placeholder for API call
              await new Promise((r) => setTimeout(r, 500))
              toast.success("Password updated")
              setCurrentPassword("")
              setNewPassword("")
              setConfirmPassword("")
            } finally {
              setSaving(false)
            }
          }}
        >
          {saving ? "Saving..." : "Update password"}
        </Button>
      </CardFooter>
    </Card>
  )
}
