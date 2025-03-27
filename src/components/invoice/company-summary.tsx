"use client"

import { TableCell, TableRow } from "@/components/ui/table"

interface CompanySummaryProps {
    companyTotals: {
        totalBox: number
        totalBillAmount: number
        totalCashAmount: number
    }
}

export function CompanySummary({ companyTotals }: CompanySummaryProps) {
    return (
        <>
            <TableRow className="bg-muted/50 font-medium">
                <TableCell colSpan={4} className="text-right">
                    Total:
                </TableCell>
                <TableCell>{companyTotals.totalBox}</TableCell>
                <TableCell colSpan={5}></TableCell>
                <TableCell>{companyTotals.totalBillAmount.toFixed(2)}</TableCell>
                <TableCell></TableCell>
                <TableCell>{companyTotals.totalCashAmount.toFixed(2)}</TableCell>
                <TableCell></TableCell>
            </TableRow>
            <TableRow className="bg-muted/50 font-medium">
                <TableCell colSpan={11} className="text-right">
                    Final Total:
                </TableCell>
                <TableCell colSpan={2} className="text-primary font-bold">
                    ₹{(companyTotals.totalBillAmount + companyTotals.totalCashAmount).toFixed(2)}
                </TableCell>
                <TableCell></TableCell>
            </TableRow>
        </>
    )
}

