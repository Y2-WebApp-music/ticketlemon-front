import { Checkbox } from "@/components/ui/checkbox"
import { FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export function FormsTab() {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-4 text-xl font-semibold">Input & Label</h2>
        <div className="max-w-sm space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@example.com" />
        </div>
      </section>
      <section>
        <h2 className="mb-4 text-xl font-semibold">Textarea</h2>
        <Textarea placeholder="Type your message here." className="max-w-md" />
      </section>
      <section>
        <h2 className="mb-4 text-xl font-semibold">Checkbox</h2>
        <div className="flex items-center gap-2">
          <Checkbox id="terms" />
          <Label htmlFor="terms">Accept terms and conditions</Label>
        </div>
      </section>
      <section>
        <h2 className="mb-4 text-xl font-semibold">Select</h2>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
            <SelectItem value="orange">Orange</SelectItem>
          </SelectContent>
        </Select>
      </section>
      <section>
        <h2 className="mb-4 text-xl font-semibold">Field (with Label)</h2>
        <FieldSet className="max-w-sm space-y-4">
          <FieldGroup>
            <FieldLabel>Username</FieldLabel>
            <Input placeholder="johndoe" />
          </FieldGroup>
          <FieldGroup>
            <FieldLabel>Bio</FieldLabel>
            <Textarea placeholder="Tell us about yourself." />
          </FieldGroup>
        </FieldSet>
      </section>
      <section>
        <h2 className="mb-4 text-xl font-semibold">Input Group</h2>
        <InputGroup className="max-w-xs">
          <InputGroupAddon>https://</InputGroupAddon>
          <InputGroupInput placeholder="example.com" />
        </InputGroup>
      </section>
    </div>
  )
}
