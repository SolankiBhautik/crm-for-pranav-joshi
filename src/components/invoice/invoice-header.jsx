"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export function InvoiceHeader({ customer, params }) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <Link href={`/`}>
        <Button variant="outline" size="icon">
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </Link>
      <div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">{customer.name}</h1>
        <p className="text-muted-foreground">Orders & Invoice</p>
      </div>
    </div>
  )
}