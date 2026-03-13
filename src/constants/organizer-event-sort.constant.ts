export const ORGANIZER_EVENT_SORT_OPTIONS = [
  { value: "date_asc", label: "Date (asc)" },
  { value: "date_desc", label: "Date (desc)" },
  { value: "name", label: "Name" },
] as const

export type OrganizerEventSortValue =
  (typeof ORGANIZER_EVENT_SORT_OPTIONS)[number]["value"]
