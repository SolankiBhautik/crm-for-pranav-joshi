"use client"

import { Card, CardContent } from "@/components/ui/card"

export function InvoiceTotals({ ordersByCompany, invoiceData }) {
  const calculateBillAmount = (order, orderInvoice) => {
    const sqft = Number(orderInvoice.sqft || 0)
    const boxNumber = Number(order.boxNumber || 0)
    const billRate = Number(orderInvoice.billRate || 0)
    const insuPercent = Number(orderInvoice.insu || 0)
    const taxPercent = Number(orderInvoice.tax || 0)

    const baseAmount = boxNumber * sqft * billRate
    const insuAmount = baseAmount * (insuPercent / 100)
    const subtotal = baseAmount + insuAmount
    const taxAmount = subtotal * (taxPercent / 100)
    return baseAmount + insuAmount + taxAmount
  }

  const totals = Object.entries(ordersByCompany).reduce((acc, [companyId, orders]) => {
    const companyTotal = orders.reduce((sum, order) => {
      const orderInvoice = invoiceData[order.id] || {}
      const billAmount = calculateBillAmount(order, orderInvoice)
      const cashRate = Number(orderInvoice.rate || 0) - Number(orderInvoice.billRate || 0)
      const cashAmount = Number(order.boxNumber || 0) * Number(orderInvoice.sqft || 0) * cashRate
      return {
        totalBox: sum.totalBox + Number(order.boxNumber || 0),
        totalBillAmount: sum.totalBillAmount + billAmount,
        totalCashAmount: sum.totalCashAmount + cashAmount
      }
    }, { totalBox: 0, totalBillAmount: 0, totalCashAmount: 0 })
    
    return {
      totalBox: acc.totalBox + companyTotal.totalBox,
      totalBillAmount: acc.totalBillAmount + companyTotal.totalBillAmount,
      totalCashAmount: acc.totalCashAmount + companyTotal.totalCashAmount
    }
  }, { totalBox: 0, totalBillAmount: 0, totalCashAmount: 0 })

  return (
    <Card className="w-full mb-8">
      <CardContent className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total Boxes</p>
            <p className="text-xl font-bold text-foreground">{totals.totalBox}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total Bill</p>
            <p className="text-xl font-bold text-foreground">₹{totals.totalBillAmount.toFixed(2)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total Cash</p>
            <p className="text-xl font-bold text-foreground">₹{totals.totalCashAmount.toFixed(2)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Final Total</p>
            <p className="text-xl font-bold text-primary">
              ₹{(totals.totalBillAmount + totals.totalCashAmount).toFixed(2)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}