export interface SellingTableRow {
  name: string
  email: string
  status: "purchased" | "pending"
  eventRound: string
  ticketType: string
  bookingTime: string
}

export interface SellingTableResponse {
  data: SellingTableRow[]
  total: number
  page: number
  perPage: number
}

export interface SellingTicketSelection {
  sessionLabel: string
  title: string
}

export const DEFAULT_SELLING_TICKET_SELECTION: SellingTicketSelection = {
  sessionLabel: "29 Mar 2026, 17:00",
  title: "VVIP + Soundcheck",
}

export const TABLE_VIEW_PAGE_SIZE_OPTIONS = [10, 15, 25] as const

export const MOCK_SELLING_ROWS: SellingTableRow[] = [
  {
    name: "Chotanansub Sophaken",
    email: "example.123@gmail.com",
    status: "purchased",
    eventRound: "29 Mar 2026, 17:00",
    ticketType: "VVIP + Soundcheck",
    bookingTime: "33 Mar 26, 33:00:00",
  },
  {
    name: "Chotanansub Sophaken",
    email: "example.123@gmail.com",
    status: "purchased",
    eventRound: "29 Mar 2026, 17:00",
    ticketType: "VVIP + Soundcheck",
    bookingTime: "33 Mar 26, 33:00:00",
  },
  {
    name: "Chotanansub Sophaken",
    email: "example.123@gmail.com",
    status: "purchased",
    eventRound: "29 Mar 2026, 17:00",
    ticketType: "VVIP + Soundcheck",
    bookingTime: "33 Mar 26, 33:00:00",
  },
  {
    name: "Chotanansub Sophaken",
    email: "example.123@gmail.com",
    status: "purchased",
    eventRound: "29 Mar 2026, 17:00",
    ticketType: "VVIP + Soundcheck",
    bookingTime: "33 Mar 26, 33:00:00",
  },
  {
    name: "Chotanansub Sophaken",
    email: "example.123@gmail.com",
    status: "purchased",
    eventRound: "29 Mar 2026, 17:00",
    ticketType: "VVIP + Soundcheck",
    bookingTime: "33 Mar 26, 33:00:00",
  },
  {
    name: "Chotanansub Sophaken",
    email: "example.123@gmail.com",
    status: "pending",
    eventRound: "29 Mar 2026, 17:00",
    ticketType: "VVIP + Soundcheck",
    bookingTime: "33 Mar 26, 33:00:00",
  },
  {
    name: "Chotanansub Sophaken",
    email: "example.123@gmail.com",
    status: "pending",
    eventRound: "29 Mar 2026, 17:00",
    ticketType: "VVIP + Soundcheck",
    bookingTime: "33 Mar 26, 33:00:00",
  },
  {
    name: "Chotanansub Sophaken",
    email: "example.123@gmail.com",
    status: "pending",
    eventRound: "29 Mar 2026, 17:00",
    ticketType: "VVIP + Soundcheck",
    bookingTime: "33 Mar 26, 33:00:00",
  },
  {
    name: "Chotanansub Sophaken",
    email: "example.123@gmail.com",
    status: "pending",
    eventRound: "29 Mar 2026, 17:00",
    ticketType: "VVIP + Soundcheck",
    bookingTime: "33 Mar 26, 33:00:00",
  },
  {
    name: "Chotanansub Sophaken",
    email: "example.123@gmail.com",
    status: "pending",
    eventRound: "29 Mar 2026, 17:00",
    ticketType: "VVIP + Soundcheck",
    bookingTime: "33 Mar 26, 33:00:00",
  },
]

export const MOCK_SELLING_TABLE_RESPONSE: SellingTableResponse = {
  data: MOCK_SELLING_ROWS,
  total: 230,
  page: 1,
  perPage: 15,
}
