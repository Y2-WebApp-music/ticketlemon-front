export const ORGANIZER_EVENT_SORT_OPTIONS = [
  { value: "date_asc", label: "Date (asc)" },
  { value: "date_desc", label: "Date (desc)" },
  { value: "name", label: "Name" },
] as const

export type OrganizerEventSortValue =
  (typeof ORGANIZER_EVENT_SORT_OPTIONS)[number]["value"]

export const TABLE_VIEW_PAGE_SIZE_OPTIONS = [10, 15, 25] as const

export const TABLE_VIEW_STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "purchased", label: "Purchased" },
  { value: "pending", label: "Pending" },
] as const
