import { PageLayout } from "@/components/layouts"
import {
  AccountSettingsSidebar,
  ChangePasswordCard,
  PaymentMethodsCard,
  ProfileForm,
  type AccountSettingsSection,
} from "@/features/profile"
import { paymentMethodsMock, userProfileMock } from "@/mocks/profile"
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
              <ProfileForm initialValues={userProfileMock} />
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
