"use client"

import { TableCell, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TILE_SIZES, GRADES } from "@/lib/order"

export function AddOrderRow({ newOrder, onChange, onSave, onCancel }) {
  return (
    <TableRow>
      <TableCell>{newOrder.srNo}</TableCell>
      <TableCell><Input value={newOrder.name} onChange={e => onChange("name", e.target.value)}  className="h-8" placeholder="Order name" /></TableCell>
      <TableCell>
        <Select value={newOrder.size} onValueChange={value => onChange("size", value)}>
          <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
          <SelectContent>{TILE_SIZES.map(size => <SelectItem key={size} value={size}>{size}</SelectItem>)}</SelectContent>
        </Select>
      </TableCell>
      <TableCell>
        <Select value={newOrder.grade} onValueChange={value => onChange("grade", value)}>
          <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
          <SelectContent>{GRADES.map(grade => <SelectItem key={grade} value={grade}>{grade}</SelectItem>)}</SelectContent>
        </Select>
      </TableCell>
      <TableCell><Input type="number" value={newOrder.boxNumber} onChange={e => onChange("boxNumber", e.target.value)} className="h-8 w-16" placeholder="Box #" /></TableCell>
      <TableCell>
        <Select value={newOrder.sqft || "27.55"} onValueChange={value => onChange("sqft", value)}>
          <SelectTrigger className="h-8 w-[100px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="27.55">27.55</SelectItem>
            <SelectItem value="15.5">15.5</SelectItem>
            <SelectItem value="8.67">8.67</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell><Input type="number" value={newOrder.rate || ""} onChange={e => onChange("rate", e.target.value)} className="h-8 w-20" placeholder="Rate" /></TableCell>
      <TableCell><Input type="number" value={newOrder.billRate || ""} onChange={e => onChange("billRate", e.target.value)} className="h-8 w-20" placeholder="Bill Rate" /></TableCell>
      <TableCell>
        <Select value={newOrder.insu || "0.5"} onValueChange={value => onChange("insu", value)}>
          <SelectTrigger className="h-8 w-20"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1%</SelectItem>
            <SelectItem value="0.5">0.50%</SelectItem>
            <SelectItem value="0.3">0.30%</SelectItem>
            <SelectItem value="0.25">0.25%</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell><Input type="number" value={newOrder.tax || "18"} onChange={e => onChange("tax", e.target.value)} className="h-8 w-20" placeholder="Tax %" /></TableCell>
      <TableCell colSpan={3}></TableCell>
      <TableCell>
        <div className="flex justify-end space-x-1">
          <Button size="icon" variant="ghost" onClick={onSave} className="h-7 w-7"><Check className="h-4 w-4" /></Button>
          <Button size="icon" variant="ghost" onClick={onCancel} className="h-7 w-7"><X className="h-4 w-4" /></Button>
        </div>
      </TableCell>
    </TableRow>
  )
}
