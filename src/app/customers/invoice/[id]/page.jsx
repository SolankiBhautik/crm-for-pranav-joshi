"use client"

import { useState, useEffect } from "react"
import { getCustomerById } from "@/lib/customer"
import { getCompanies, getCustomerOrders, addCompany, addOrder } from "@/lib/order"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Save, Plus, Download } from "lucide-react"
import { notFound, useParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import Loader from "@/components/Loader"
import { toast } from "react-hot-toast"
import { CompanyCard } from "@/components/invoice/company-card"
import { AddCompanyForm } from "@/components/invoice/add-company-form"
import { InvoiceHeader } from "@/components/invoice/invoice-header"
import { InvoiceTotals } from "@/components/invoice/invoice-totals"
import ReceiptPDF from "@/components/invoice/receipt-pdf"
import { PDFDownloadLink } from '@react-pdf/renderer'

export default function CustomerInvoicePage() {
  const params = useParams()
  const [customer, setCustomer] = useState(null)
  const [allCompanies, setAllCompanies] = useState([])
  const [customerCompanies, setCustomerCompanies] = useState([])
  const [orders, setOrders] = useState([])
  const [invoiceData, setInvoiceData] = useState({})
  const [loading, setLoading] = useState(true)
  const [showAddCompany, setShowAddCompany] = useState(false)

  const ordersByCompany = orders.reduce((acc, order) => {
    acc[order.companyId] = acc[order.companyId] || []
    acc[order.companyId].push(order)
    return acc
  }, {})

  async function loadData() {
    try {
      setLoading(true)
      const [customerData, companiesData, ordersData] = await Promise.all([
        getCustomerById(params.id),
        getCompanies(),
        getCustomerOrders(params.id),
      ])

      setCustomer(customerData)
      setAllCompanies(companiesData)
      setCustomerCompanies(companiesData.filter(c => ordersData.some(o => o.companyId === c.id)))
      setOrders(ordersData)
      
      const initialInvoiceData = {}
      ordersData.forEach(order => {
        initialInvoiceData[order.id] = {
          sqft: order.sqft || "27.55",
          rate: order.rate || "0",
          billRate: order.billRate || "0",
          insu: order.insu || "0.5",
          tax: order.tax || "18",
        }
      })
      setInvoiceData(initialInvoiceData)
    } catch (error) {
      console.error("Error loading data:", error)
      toast.error("Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [params.id])

  function handleInvoiceDataChange(orderId, field, value) {
    setInvoiceData(prev => ({
      ...prev,
      [orderId]: { ...prev[orderId], [field]: value }
    }))
  }

  async function handleAddCompany(value) {
    try {
      const existingCompany = allCompanies.find(c => c.name.toLowerCase() === value.toLowerCase())
      if (existingCompany) {
        if (!customerCompanies.some(c => c.id === existingCompany.id)) {
          setCustomerCompanies(prev => [...prev, existingCompany])
          await loadData()
        }
        setShowAddCompany(false)
        return existingCompany
      }

      const newCompany = await addCompany(value)
      setAllCompanies(prev => [...prev, newCompany])
      setCustomerCompanies(prev => [...prev, newCompany])
      await loadData()
      setShowAddCompany(false)
      return newCompany
    } catch (error) {
      console.error("Error adding company:", error)
      toast.error("Failed to add company")
      return null
    }
  }

  async function handleSelectCompany(companyId) {
    console.log('Enter company');
    const selectedCompany = allCompanies.find(c => c.id === companyId)
    if (selectedCompany && !customerCompanies.some(c => c.id === selectedCompany.id)) {
      // Add the company to customerCompanies
      setCustomerCompanies(prev => [...prev, selectedCompany])

      // Create an empty order for the selected company
      const newOrder = {
        companyId: selectedCompany.id,
        customerId: params.id,
        name: "",
        size: "",
        grade: "PRE",
        boxNumber: 0,
        tpRate: 0,
        amount: 0,
        srNo: (ordersByCompany[selectedCompany.id]?.length || 0) + 1,
        sqft: "27.55",
        rate: 0,
        billRate: 0,
        insu: "0.50",
        tax: 18,
      }

      // Add the order to the backend and get the created order with an ID
      const createdOrder = await addOrder(params.id, newOrder)
      
      // Update local state with the new order
      setOrders(prev => [...prev, createdOrder])
      setInvoiceData(prev => ({
        ...prev,
        [createdOrder.id]: {
          sqft: 27.55,
          rate: 0,
          billRate: 0,
          insu: 0.5,
          tax: 18,
        }
      }))

      // Pass the new order ID to CompanyCard to set it as editing
      setShowAddCompany(false)
    }
  }

  if (loading) return <Loader className="h-screen" />
  if (!customer) return notFound()
  return (
    <div className="container mx-auto py-10">
      <InvoiceHeader customer={customer} params={params} />
      <InvoiceTotals ordersByCompany={ordersByCompany} invoiceData={invoiceData} />
      
      <div className="flex justify-between items-center mb-6">
        {showAddCompany ? (
          <AddCompanyForm
            allCompanies={allCompanies}
            handleAddCompany={handleAddCompany}
            handleCompanySelect={handleSelectCompany}
            onCancel={() => setShowAddCompany(false)}
          />
        ) : (
          <Button variant="outline" onClick={() => setShowAddCompany(true)}>
            <Plus className="h-4 w-4 mr-2" /> Add Company
          </Button>
        )}
        <PDFDownloadLink
          document={<ReceiptPDF customer={customer} ordersByCompany={ordersByCompany} customerCompanies={customerCompanies} />}
          fileName={`Receipt_${customer.name}_${new Date().toISOString().split('T')[0]}.pdf`}
        >
          {({ loading }) => (
            <Button disabled={loading}>
              <Download className="h-4 w-4 mr-2" />
              {loading ? 'Generating PDF...' : 'Download Receipt'}
            </Button>
          )}
        </PDFDownloadLink>
      </div>

      <div className="space-y-8">
        {customerCompanies.map(company => (
          <CompanyCard
            key={company.id}
            customer={customer}
            company={company}
            orders={ordersByCompany[company.id] || []}
            invoiceData={invoiceData}
            onInvoiceDataChange={handleInvoiceDataChange}
            onDataChange={loadData}
          />
        ))}
        {customerCompanies.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No companies added yet. Add a company to start creating orders.
          </div>
        )}
      </div>
    </div>
  )
}
