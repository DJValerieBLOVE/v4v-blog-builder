import { cva } from "class-variance-authority"

export const navigationMenuTriggerStyle = cva(
  "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-foreground focus:bg-gray-100 focus:text-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-50 data-[state=open]:bg-gray-50"
)