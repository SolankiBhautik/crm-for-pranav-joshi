"use client"

import { useState, useEffect } from "react"
import { getCustomerById } from "@/lib/customer"
import { getCompanies, getCustomerOrders } from "@/lib/order"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Save } from "lucide-react"
import { notFound, useParams } from "next/navigation"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import Loader from "@/components/Loader"

export default function CustomerInvoicePage() {
  const params = useParams()
  const [customer, setCustomer] = useState(null)
  const [companies, setCompanies] = useState([])
  const [orders, setOrders] = useState([])
  const [invoiceData, setInvoiceData] = useState({})
  const [loading, setLoading] = useState(true)

  // Group orders by company
  const ordersByCompany = orders.reduce((acc, order) => {
    if (!acc[order.companyId]) {
      acc[order.companyId] = []
    }
    acc[order.companyId].push(order)
    return acc
  }, {})

  // Calculate totals for a company's orders
  const calculateCompanyTotals = (companyId) => {
    const companyOrders = ordersByCompany[companyId] || []

    return companyOrders.reduce(
      (acc, order) => {
        const orderInvoice = invoiceData[order.id] || {
          sqft: false,
          rate: 0,
          billRate: 0,
          insu: 0.5,
          tax: 18,
          cashRate: 0,
        }

        const sqft = Number(order.boxNumber) * (orderInvoice.sqft ? 1 : 0)
        const billAmount = calculateBillAmount(order, orderInvoice)
        const cashRate = Number(orderInvoice.rate) - Number(orderInvoice.billRate)
        const cashAmount = sqft * cashRate

        return {
          totalBox: acc.totalBox + Number(order.boxNumber),
          totalBillAmount: acc.totalBillAmount + billAmount,
          totalCashAmount: acc.totalCashAmount + cashAmount,
        }
      },
      { totalBox: 0, totalBillAmount: 0, totalCashAmount: 0 },
    )
  }

  // Calculate bill amount for an order
  const calculateBillAmount = (order, orderInvoice) => {
    if (!orderInvoice) return 0

    const sqft = Number(order.boxNumber) * (orderInvoice.sqft ? 1 : 0)
    const baseAmount = sqft * Number(orderInvoice.billRate)
    const insuAmount = baseAmount * (Number(orderInvoice.insu) / 100)
    const taxAmount = baseAmount * (Number(orderInvoice.tax) / 100)

    return baseAmount + insuAmount + taxAmount
  }

  // Calculate grand totals across all companies
  const calculateGrandTotals = () => {
    return Object.keys(ordersByCompany).reduce(
      (acc, companyId) => {
        const companyTotals = calculateCompanyTotals(companyId)
        return {
          totalBox: acc.totalBox + companyTotals.totalBox,
          totalBillAmount: acc.totalBillAmount + companyTotals.totalBillAmount,
          totalCashAmount: acc.totalCashAmount + companyTotals.totalCashAmount,
        }
      },
      { totalBox: 0, totalBillAmount: 0, totalCashAmount: 0 },
    )
  }

  const loadData = async () => {
    try {
      const [customerData, companiesData, ordersData] = await Promise.all([
        getCustomerById(params.id),
        getCompanies(),
        getCustomerOrders(params.id),
      ])

      setCustomer(customerData)
      setCompanies(companiesData)
      setOrders(ordersData)

      // Initialize invoice data for each order
      const initialInvoiceData = {}
      ordersData.forEach((order) => {
        initialInvoiceData[order.id] = {
          sqft: false,
          rate: 0,
          billRate: 0,
          insu: 0.5, // Default 0.5%
          tax: 18, // Default 18%
          cashRate: 0,
        }
      })

      setInvoiceData(initialInvoiceData)
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [params.id])

  const handleInvoiceDataChange = (orderId, field, value) => {
    setInvoiceData((prev) => {
      const updatedData = {
        ...prev,
        [orderId]: {
          ...prev[orderId],
          [field]: value,
        },
      }

      // Auto-calculate cash rate when rate or bill rate changes
      if (field === "rate" || field === "billRate" || field === "sqft") {
        const rate = field === "rate" ? value : updatedData[orderId].rate
        const billRate = field === "billRate" ? value : updatedData[orderId].billRate
        // const sqft = field === "sqft" ? value : updatedData[orderId].sqft
        updatedData[orderId].cashRate = Number(rate) - Number(billRate)
      }

      return updatedData
    })
  }

  const handleSaveInvoice = () => {
    // Here you would implement saving the invoice data to your backend
    console.log("Saving invoice data:", invoiceData)
    alert("Invoice saved successfully!")
  }

  if (loading) return <Loader className="h-screen"/>
  if (!customer) return notFound()

  const grandTotals = calculateGrandTotals()

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href={`/customers/${params.id}`}>
            <Button variant="ghost" size="icon" className="border">
              <ArrowLeft className="h-5 w-5 text-gray-300" />
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold tracking-tight">{customer.name}</h1>
            <p className="text-muted-foreground">Invoice</p>
          </div>
        </div>

        {/* Grand totals summary */}
        <Card className="w-auto">
          <CardContent className="p-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Boxes</p>
                <p className="text-xl font-bold">{grandTotals.totalBox}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Bill</p>
                <p className="text-xl font-bold">₹{grandTotals.totalBillAmount.toFixed(2)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Cash</p>
                <p className="text-xl font-bold">₹{grandTotals.totalCashAmount.toFixed(2)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Final Total</p>
                <p className="text-xl font-bold">
                  ₹{(grandTotals.totalBillAmount + grandTotals.totalCashAmount).toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end mb-4">
        <Button onClick={handleSaveInvoice}>
          <Save className="h-4 w-4 mr-2" /> Save Invoice
        </Button>
      </div>

      <div className="space-y-8">
        {companies.map((company) => {
          const companyOrders = ordersByCompany[company.id] || []
          if (companyOrders.length === 0) return null

          const companyTotals = calculateCompanyTotals(company.id)

          return (
            <Card key={company.id}>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">{company.name}</h2>
                <Table>
                  <TableHeader>
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
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {companyOrders.map((order, index) => {
                      const orderInvoice = invoiceData[order.id] || {}
                      const sqft = Number(order.boxNumber) * (orderInvoice.sqft ? 1 : 0)
                      const billAmount = calculateBillAmount(order, orderInvoice)
                      const cashRate = Number(orderInvoice.rate) - Number(orderInvoice.billRate)
                      const cashAmount = sqft * cashRate

                      return (
                        <TableRow key={order.id}>
                          <TableCell>{order.srNo || index + 1}</TableCell>
                          <TableCell>{order.name}</TableCell>
                          <TableCell>{order.size}</TableCell>
                          <TableCell>{order.grade}</TableCell>
                          <TableCell>{order.boxNumber}</TableCell>
                          <TableCell>
                            <Select
                              value={orderInvoice.sqft?.toString() || "27.55"}
                              onValueChange={(value) => handleInvoiceDataChange(order.id, "sqft", value)}
                            >
                              <SelectTrigger className="h-8 w-[100px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="27.55">27.55%</SelectItem>
                                <SelectItem value="15.5">15.5%</SelectItem>
                                <SelectItem value="8.67">8.67%</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={orderInvoice.rate || ""}
                              onChange={(e) => handleInvoiceDataChange(order.id, "rate", e.target.value)}
                              className="h-8 w-20"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={orderInvoice.billRate || ""}
                              onChange={(e) => handleInvoiceDataChange(order.id, "billRate", e.target.value)}
                              className="h-8 w-20"
                            />
                          </TableCell>
                          <TableCell>
                            <Select
                              value={orderInvoice.insu?.toString() || "0.5"}
                              onValueChange={(value) => handleInvoiceDataChange(order.id, "insu", value)}
                            >
                              <SelectTrigger className="h-8 w-20">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">1%</SelectItem>
                                <SelectItem value="0.5">0.50%</SelectItem>
                                <SelectItem value="0.3">0.30%</SelectItem>
                                <SelectItem value="0.25">0.25%</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={orderInvoice.tax || "18"}
                              onChange={(e) => handleInvoiceDataChange(order.id, "tax", e.target.value)}
                              className="h-8 w-20"
                            />
                          </TableCell>
                          <TableCell>{billAmount.toFixed(2)}</TableCell>
                          <TableCell>{cashRate.toFixed(2)}</TableCell>
                          <TableCell>{cashAmount.toFixed(2)}</TableCell>
                        </TableRow>
                      )
                    })}

                    {/* Company totals */}
                    <TableRow className="bg-muted/50 font-medium">
                      <TableCell colSpan={4} className="text-right">
                        Total:
                      </TableCell>
                      <TableCell>{companyTotals.totalBox}</TableCell>
                      <TableCell colSpan={5}></TableCell>
                      <TableCell>{companyTotals.totalBillAmount.toFixed(2)}</TableCell>
                      <TableCell></TableCell>
                      <TableCell>{companyTotals.totalCashAmount.toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow className="bg-muted/50 font-medium">
                      <TableCell colSpan={11} className="text-right">
                        Final Total:
                      </TableCell>
                      <TableCell colSpan={2}>
                        {(companyTotals.totalBillAmount + companyTotals.totalCashAmount).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )
        })}

        {Object.keys(ordersByCompany).length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No orders found for this customer. Please add orders first.
          </div>
        )}
      </div>
    </div>
  )
}

