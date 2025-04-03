"use client"

import { useState, useCallback } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { OrderRow } from "./order-row"
import { AddOrderRow } from "./add-order-row"
import { CompanySummary } from "./company-summary"
import { addOrder, updateOrder, deleteOrder } from "@/lib/order"
import { toast } from "react-hot-toast"

export function CompanyCard({ company, customer, orders, invoiceData, onInvoiceDataChange, onDataChange }) {
  const [editingOrderId, setEditingOrderId] = useState(null)
  const [addingOrder, setAddingOrder] = useState(false)
  const [newOrder, setNewOrder] = useState({
    name: "",
    size: "",
    grade: "",
    boxNumber: 0,
    tpRate: 0,
    amount: 0,
    srNo: orders.length + 1,
    sqft: 27.55,
    rate: 0,
    billRate: 0,
    insu: 0.5,
    tax: 18
  })

  const calculateBillAmount = useCallback((order, orderInvoice) => {
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
  }, [])

  const companyTotals = orders.reduce((acc, order) => {
    const orderInvoice = invoiceData[order.id] || {}
    const billAmount = calculateBillAmount(order, orderInvoice)
    const cashRate = Number(orderInvoice.rate || 0) - Number(orderInvoice.billRate || 0)
    let cashAmount;
    if(order.size == '12x18'){
      cashAmount = Number(order.boxNumber || 0) * cashRate
    }else {
      cashAmount = Number(order.boxNumber || 0) * Number(orderInvoice.sqft || 0) * cashRate
    }
    return {
      totalBox: acc.totalBox + Number(order.boxNumber || 0),
      totalBillAmount: acc.totalBillAmount + billAmount,
      totalCashAmount: acc.totalCashAmount + cashAmount
    }
  }, { totalBox: 0, totalBillAmount: 0, totalCashAmount: 0 })

  const handleAddOrder = async () => {
    try {
      await addOrder(customer.id, { ...newOrder, companyId: company.id })
      setAddingOrder(false)
      setNewOrder({ ...newOrder, srNo: orders.length + 2 })
      onDataChange()
      toast.success("Order added successfully")
    } catch (error) {
      toast.error("Failed to add order")
      console.error("Error adding order:", error)
    }
  }

  const handleUpdateOrder = async (orderId, updatedOrder) => {
    try {
      await updateOrder(orderId, updatedOrder)
      setEditingOrderId(null)
      onDataChange()
      toast.success("Order updated successfully")
    } catch (error) {
      toast.error("Failed to update order")
    }
  }

  const handleDeleteOrder = async (orderId) => {
    try {
      await deleteOrder(orderId)
      onDataChange()
      toast.success("Order deleted successfully")
    } catch (error) {
      toast.error("Failed to delete order")
    }
  }

  return (
    <Card className="bg-card">
      <CardHeader className="pb-2">
        <CardTitle>{company.name}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-auto max-h-[500px]">
          <Table>
            <TableHeader className="sticky top-0 bg-card z-10">
              <TableRow>
                <TableHead className="w-[50px]">Sr.</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Box</TableHead>
                <TableHead>Sq.Ft</TableHead>
                <TableHead>Rate</TableHead>
                <TableHead>Bill Rate</TableHead>
                <TableHead>Insu.</TableHead>
                <TableHead>Tax</TableHead>
                <TableHead>Bill Amount</TableHead>
                <TableHead>Cash Rate</TableHead>
                <TableHead>Cash Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <OrderRow
                  key={order.id}
                  order={order}
                  isEditing={editingOrderId === order.id}
                  orderInvoice={invoiceData[order.id] || {}}
                  calculateBillAmount={calculateBillAmount}
                  onInvoiceDataChange={onInvoiceDataChange}
                  onEdit={() => setEditingOrderId(order.id)}
                  onUpdate={handleUpdateOrder}
                  onCancel={() => setEditingOrderId(null)}
                  onDelete={handleDeleteOrder}
                />
              ))}
              {addingOrder ? (
                <AddOrderRow
                  newOrder={newOrder}
                  onChange={(field, value) => setNewOrder(prev => ({ ...prev, [field]: value }))}
                  onSave={handleAddOrder}
                  onCancel={() => setAddingOrder(false)}
                />
              ) : (
                <TableRow>
                  <TableHead colSpan={14}>
                    <Button
                      variant="ghost"
                      className="w-full flex items-center justify-center py-2"
                      onClick={() => setAddingOrder(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" /> Add Order
                    </Button>
                  </TableHead>
                </TableRow>
              )}
              <CompanySummary companyTotals={companyTotals} />
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
