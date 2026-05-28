import { PageLayout } from "@/components/layouts"
import {
  AccountSettingsSidebar,
  ChangePasswordCard,
  PaymentMethodsCard,
  ProfileForm,
  type AccountSettingsSection,
} from "@/features/profile"
import { paymentMethodsMock } from "@/mocks/profile"
import { getProfile } from "@/services/userService"
import { updateUser, type UserUpdatePayload } from "@/services/staffService"
import { useUserStore } from "@/stores/user-store"
import type { UserProfile } from "@/types/profile"
import * as React from "react"

export default function ProfilePage() {
  const sections: AccountSettingsSection[] = [
    { id: "basic", label: "Basic Information" },
    { id: "password", label: "Change Password" },
    { id: "payment", label: "Payment" },
    { id: "interests", label: "Customize your interests" },
    { id: "coupon", label: "My Coupon" },
  ]

  const [activeId, setActiveId] = React.useState<string>("basic")
  const [profile, setProfile] = React.useState<UserProfile | null>(null)
  const [loading, setLoading] = React.useState(true)

  const userId = useUserStore((s) => s.user_id)

  React.useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }
    getProfile(userId)
      .then(setProfile)
      .finally(() => setLoading(false))
  }, [userId])

  async function handleSaveProfile(values: UserProfile) {
    if (!userId) return
    const payload: UserUpdatePayload = {
      first_name: values.first_name,
      last_name: values.last_name,
      phone_number: values.phone_country_code + values.phone,
      profile_image: values.image_url || undefined,
    }
    await updateUser(userId, payload)
    setProfile(values)
  }

  return (
    <PageLayout>
      <div className="mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-medium tracking-tight text-primary">
            Profile
          </h1>
          <p className="mt-1 text-base text-muted-foreground">
            Edit your personal information.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <AccountSettingsSidebar
              sections={sections}
              activeId={activeId}
              onSelect={setActiveId}
            />
          </div>

          <div className="max-w-[720px]">
            {activeId === "basic" && (
              loading ? (
                <div className="rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">
                  Loading profile...
                </div>
              ) : profile ? (
                <ProfileForm initialValues={profile} onSave={handleSaveProfile} />
              ) : (
                <div className="rounded-xl border border-border bg-card p-5 text-sm text-destructive">
                  Failed to load profile.
                </div>
              )
            )}
            {activeId === "password" && <ChangePasswordCard />}
            {activeId === "payment" && (
              <PaymentMethodsCard initialMethods={paymentMethodsMock} />
            )}
            {activeId === "interests" && (
              <div className="rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">
                Customize your interests (TODO)
              </div>
            )}
            {activeId === "coupon" && (
              <div className="rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">
                My Coupon (TODO)
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
