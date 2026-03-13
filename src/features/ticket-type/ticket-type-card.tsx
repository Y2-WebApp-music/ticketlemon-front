import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Minus, Plus, Upload } from "lucide-react"

export type TicketTypeCardVariant =
  | "default"
  | "selected"
  | "available"
  | "soldOut"
  | "notOnSale"
  | "saleEnd"

export interface TicketTypeCardBaseProps {
  /** Ticket type name */
  title: string
  /** Short description */
  description?: string
  /** Price string e.g. "1,800 THB" */
  price: string
  className?: string
}

export interface TicketTypeCardDefaultProps extends TicketTypeCardBaseProps {
  variant: "default"
  /** Current quantity selected (0 = not selected) */
  quantity?: number
  onQuantityChange?: (qty: number) => void
}

export interface TicketTypeCardSelectedProps extends TicketTypeCardBaseProps {
  variant: "selected"
  quantity: number
  onQuantityChange?: (qty: number) => void
}

export interface TicketTypeCardAvailableProps extends TicketTypeCardBaseProps {
  variant: "available"
  /** Number of tickets left */
  remaining: number
  href?: string
  onClick?: () => void
}

export interface TicketTypeCardSoldOutProps extends TicketTypeCardBaseProps {
  variant: "soldOut"
}

export interface TicketTypeCardNotOnSaleProps extends TicketTypeCardBaseProps {
  variant: "notOnSale"
  /** When sale starts e.g. "23 Mar 26, 10:00" */
  saleStartLabel: string
}

export interface TicketTypeCardSaleEndProps extends TicketTypeCardBaseProps {
  variant: "saleEnd"
  /** Sale end date/time e.g. "23 Mar 26, 17:00:12" */
  saleEndLabel: string
  onExportData?: () => void
}

export type TicketTypeCardProps =
  | TicketTypeCardDefaultProps
  | TicketTypeCardSelectedProps
  | TicketTypeCardAvailableProps
  | TicketTypeCardSoldOutProps
  | TicketTypeCardNotOnSaleProps
  | TicketTypeCardSaleEndProps

const cardBase =
  "flex w-full flex-col items-start gap-2 rounded-xl border bg-card p-5 text-left transition-shadow sm:flex-row sm:items-center sm:justify-between sm:gap-4"

function QuantityStepper({
  value,
  onChange,
  disabled,
  className,
}: {
  value: number
  onChange: (v: number) => void
  disabled?: boolean
  className?: string
}) {
  return (
    <div className={cn("flex items-center gap-3 sm:gap-3.5", className)}>
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        aria-label="Decrease quantity"
        disabled={disabled || value <= 0}
        onClick={() => onChange(Math.max(0, value - 1))}
      >
        <Minus className="size-4" />
      </Button>
      <span
        className={cn(
          "min-w-[2ch] text-center text-2xl font-medium tabular-nums",
          value > 0 && "text-primary"
        )}
      >
        {value}
      </span>
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        aria-label="Increase quantity"
        disabled={disabled}
        onClick={() => onChange(value + 1)}
      >
        <Plus className="size-4" />
      </Button>
    </div>
  )
}

export function TicketTypeCard(props: TicketTypeCardProps) {
  const { title, description, price, className } = props
  const content = (
    <>
      <div className="min-w-0 flex-1 space-y-0.5">
        <p className="text-lg leading-7 font-medium tracking-tight text-foreground">
          {title}
        </p>
        {description && (
          <p className="line-clamp-2 text-base leading-7 text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {(props.variant === "default" || props.variant === "selected") && (
        <div
          className="flex shrink-0 items-center gap-4 sm:min-w-[160px]"
          onClick={
            props.variant === "default" ? (e) => e.stopPropagation() : undefined
          }
        >
          <p className="text-lg leading-7 font-medium tracking-tight text-foreground sm:min-w-[160px]">
            {price}
          </p>
          <QuantityStepper
            value={props.quantity ?? 0}
            onChange={props.onQuantityChange ?? (() => {})}
          />
        </div>
      )}
      {props.variant === "available" && (
        <div className="flex shrink-0 flex-wrap items-center gap-6">
          <div className="flex flex-col items-center sm:min-w-[160px]">
            <p className="text-lg leading-7 font-medium text-foreground">
              {price}
            </p>
            <p className="text-sm leading-5 text-muted-foreground">
              per ticket
            </p>
          </div>
          <div className="flex flex-col items-center sm:min-w-[160px]">
            <p className="text-lg leading-7 font-medium text-foreground">
              {props.remaining}
            </p>
            <p className="text-sm leading-5 text-muted-foreground">remaining</p>
          </div>
        </div>
      )}
      {props.variant === "soldOut" && (
        <div className="flex shrink-0 flex-wrap items-center gap-6">
          <div className="flex flex-col items-center sm:min-w-[160px]">
            <p className="text-lg leading-7 font-medium text-foreground">
              {price}
            </p>
            <p className="text-sm leading-5 text-muted-foreground">
              per ticket
            </p>
          </div>
          <div className="flex flex-col items-center sm:min-w-[160px]">
            <p className="text-lg leading-7 font-medium text-foreground">
              Sold Out
            </p>
          </div>
        </div>
      )}
      {props.variant === "notOnSale" && (
        <div className="flex shrink-0 flex-wrap items-center gap-6">
          <div className="flex flex-col items-center sm:min-w-[160px]">
            <p className="text-lg leading-7 font-medium text-foreground">
              {price}
            </p>
            <p className="text-sm leading-5 text-muted-foreground">
              per ticket
            </p>
          </div>
          <div className="flex flex-col items-center sm:min-w-[160px]">
            <p className="text-lg leading-7 font-medium text-foreground">
              {props.saleStartLabel}
            </p>
            <p className="text-sm leading-5 text-muted-foreground">
              start sale
            </p>
          </div>
        </div>
      )}
      {props.variant === "saleEnd" && (
        <div className="flex shrink-0 flex-wrap items-center gap-4">
          <div className="flex flex-col items-center sm:min-w-[160px]">
            <p className="text-sm leading-5 text-muted-foreground">Sale End</p>
            <p className="text-base leading-6 font-medium text-foreground">
              {props.saleEndLabel}
            </p>
          </div>
          {props.onExportData && (
            <Button
              type="button"
              variant="outline"
              className="sm:min-w-[160px]"
              onClick={props.onExportData}
            >
              <Upload className="size-4" />
              Export Data
            </Button>
          )}
        </div>
      )}
    </>
  )

  const isClickable =
    props.variant === "available" &&
    (props.href != null || props.onClick != null)
  const isDimmed = props.variant === "soldOut"
  const isSelected = props.variant === "selected"
  const cardClassName = cn(
    cardBase,
    isSelected &&
      "border-primary shadow-[0_0_4px_var(--primary)] dark:shadow-[0_0_4px_var(--primary)]",
    isDimmed && "opacity-50",
    className
  )

  if (props.variant === "available" && props.href) {
    return (
      <a
        href={props.href}
        className={cn(cardClassName, "cursor-pointer hover:bg-muted/50")}
      >
        {content}
      </a>
    )
  }

  if (isClickable && props.variant === "available" && props.onClick) {
    return (
      <button
        type="button"
        className={cn(cardClassName, "cursor-pointer hover:bg-muted/50")}
        onClick={props.onClick}
      >
        {content}
      </button>
    )
  }

  return <div className={cardClassName}>{content}</div>
}
