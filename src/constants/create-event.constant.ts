export const CREATE_EVENT_CATEGORY_OPTIONS = [
  { value: "concert", label: "Concert" },
  { value: "meetup", label: "Meetup" },
  { value: "conference", label: "Conference" },
] as const

export const CREATE_EVENT_IMPACT_GENRE_OPTIONS = [
  { value: "kpop", label: "KPOP, Korea" },
  { value: "pop", label: "Pop" },
] as const

export const CREATE_EVENT_SIDEBAR_SECTIONS = [
  {
    id: "event-cover",
    label: "Event Cover",
    description: "Upload poster and thumbnail images for your event.",
  },
  {
    id: "event-detail",
    label: "Event Detail",
    description:
      "Basic event information: name, category, location, and age restriction.",
  },
  {
    id: "event-date-time",
    label: "Event Date and Time",
    description: "Set when your event starts and ends.",
  },
  {
    id: "event-description",
    label: "Event Description",
    description: "Add a description to help attendees understand your event.",
  },
  {
    id: "sale-date-time",
    label: "Sale Ticket Date and Time",
    description: "Set when tickets go on sale and when sales end.",
  },
  {
    id: "ticket-type",
    label: "Ticket Type",
    description: "Add ticket types with name, price, and quantity.",
  },
  {
    id: "ticket-setting",
    label: "Ticket Setting",
    description: "Limit how many tickets can be bought per order.",
  },
  {
    id: "staff",
    label: "Staff",
    description: "Add staff members with reserve codes.",
  },
] as const
