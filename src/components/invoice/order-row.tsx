"use client"

import { useState, useEffect } from "react"
import { TableCell, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Check, X, Edit, Trash2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { TILE_SIZES, GRADES } from "@/lib/order"

export function OrderRow({ order, isEditing, orderInvoice, calculateBillAmount, onInvoiceDataChange, onEdit, onUpdate, onCancel, onDelete }) {
  const [tempOrder, setTempOrder] = useState({ ...order })

  useEffect(() => {
    if (isEditing) setTempOrder({ ...order })
  }, [isEditing, order])

  const handleChange = (field, value) => {
    setTempOrder(prev => ({ ...prev, [field]: value }))
    if (["rate", "billRate"].includes(field)) {
      onInvoiceDataChange(order.id, field, value)
    }
  }

  const billAmount = calculateBillAmount(order, orderInvoice)
  const cashRate = Number(orderInvoice.rate || 0) - Number(orderInvoice.billRate || 0)
  const cashAmount = Number(order.boxNumber || 0) * Number(orderInvoice.sqft || 0) * cashRate

  return (
    <TableRow>
      <TableCell>{isEditing ? <Input type="number" value={tempOrder.srNo || ""} onChange={e => handleChange("srNo", e.target.value)} className="h-8 w-12" /> : order.srNo}</TableCell>
      <TableCell>{isEditing ? <Input value={tempOrder.name || ""} onChange={e => handleChange("name", e.target.value)} className="h-8" /> : order.name}</TableCell>
      <TableCell>{isEditing ? (
        <Select value={tempOrder.size || ""} onValueChange={value => handleChange("size", value)}>
          <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
          <SelectContent>{TILE_SIZES.map(size => <SelectItem key={size} value={size}>{size}</SelectItem>)}</SelectContent>
        </Select>
      ) : order.size}</TableCell>
      <TableCell>{isEditing ? (
        <Select value={tempOrder.grade || ""} onValueChange={value => handleChange("grade", value)}>
          <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
          <SelectContent>{GRADES.map(grade => <SelectItem key={grade} value={grade}>{grade}</SelectItem>)}</SelectContent>
        </Select>
      ) : order.grade}</TableCell>
      <TableCell>{isEditing ? <Input type="number" value={tempOrder.boxNumber || ""} onChange={e => handleChange("boxNumber", e.target.value)} className="h-8 w-16" /> : order.boxNumber}</TableCell>
      <TableCell>{isEditing ? (
        <Select value={orderInvoice.sqft || "27.55"} onValueChange={value => onInvoiceDataChange(order.id, "sqft", value)}>
          <SelectTrigger className="h-8 w-[100px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="46.50">46.50</SelectItem>
            <SelectItem value="27.55">27.55</SelectItem>
            <SelectItem value="25.83">25.83</SelectItem>
            <SelectItem value="20.68">20.68</SelectItem>
            <SelectItem value="15.50">15.50</SelectItem>
            <SelectItem value="12.91">12.91</SelectItem>
            <SelectItem value="8.67">8.67</SelectItem>
          </SelectContent>
        </Select>
      ) : orderInvoice.sqft || "27.55"}</TableCell>
      <TableCell>{isEditing ? <Input type="number" value={orderInvoice.rate || ""} onChange={e => handleChange("rate", e.target.value)} className="h-8 w-20" /> : orderInvoice.rate || "0"}</TableCell>
      <TableCell>{isEditing ? <Input type="number" value={orderInvoice.billRate || ""} onChange={e => handleChange("billRate", e.target.value)} className="h-8 w-20" /> : orderInvoice.billRate || "0"}</TableCell>
      <TableCell>{isEditing ? (
        <Select value={orderInvoice.insu || "0.5"} onValueChange={value => onInvoiceDataChange(order.id, "insu", value)}>
          <SelectTrigger className="h-8 w-20"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1%</SelectItem>
            <SelectItem value="0.5">0.50%</SelectItem>
            <SelectItem value="0.3">0.30%</SelectItem>
            <SelectItem value="0.25">0.25%</SelectItem>
            <SelectItem value="0">0%</SelectItem>
          </SelectContent>
        </Select>
      ) : orderInvoice.insu || "0.5"}</TableCell>
      <TableCell>{isEditing ? <Input type="number" value={orderInvoice.tax || "18"} onChange={e => onInvoiceDataChange(order.id, "tax", e.target.value)} className="h-8 w-20" /> : orderInvoice.tax || "18"}</TableCell>
      <TableCell>{billAmount.toFixed(2)}</TableCell>
      <TableCell>{cashRate.toFixed(2)}</TableCell>
      <TableCell>{cashAmount.toFixed(2)}</TableCell>
      <TableCell>
        <div className="flex justify-end space-x-1">
          {isEditing ? (
            <>
              <Button size="icon" variant="ghost" onClick={() => onUpdate(order.id, { ...tempOrder, ...orderInvoice })} className="h-7 w-7">
                <Check className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" onClick={onCancel} className="h-7 w-7">
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button size="icon" variant="ghost" onClick={onEdit} className="h-7 w-7">
                <Edit className="h-4 w-4" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Order</AlertDialogTitle>
                    <AlertDialogDescription>Are you sure you want to delete this order? This action cannot be undone.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onDelete(order.id)} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </div>
      </TableCell>
    </TableRow>
  )
}
