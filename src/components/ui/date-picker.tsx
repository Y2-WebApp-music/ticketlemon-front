import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { ChevronDownIcon } from "lucide-react"

export interface DatePickerProps {
  id?: string
  value?: Date
  onSelect?: (date: Date | undefined) => void
  placeholder?: string
  className?: string
  triggerClassName?: string
  disabled?: boolean
  /** Date format for displayed value. Default: "PPP" */
  dateFormat?: string
  captionLayout?: "dropdown" | "label" | "dropdown-months" | "dropdown-years"
}

export function DatePicker({
  id,
  value,
  onSelect,
  placeholder = "Please enter date of birth",
  className,
  triggerClassName,
  disabled,
  dateFormat = "PPP",
  captionLayout= "dropdown"
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            value ? "text-foreground" : "text-muted-foreground",
            "w-full justify-between rounded-lg font-normal border-input hover:bg-primary-foreground aria-expanded:text-foreground [&_svg]:text-foreground [&_svg]:opacity-70",
            triggerClassName
          )}
        >
          {value ? format(value, dateFormat) : placeholder}
          <ChevronDownIcon className="size-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("w-auto p-0", className)} align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onSelect}
          captionLayout={captionLayout}
        />
      </PopoverContent>
    </Popover>
  )
}
