'use client';

import { useState, useEffect } from 'react';
import { getCustomerById } from '@/lib/customer';
import { getCompanies, getCustomerOrders, addCompany, addOrder, TILE_SIZES, GRADES } from '@/lib/order';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, Check, X, House } from 'lucide-react';
import { notFound, useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Combobox } from '@/components/combobox';
import Loader from '@/components/Loader';

export default function CustomerOrderPage() {
  const params = useParams();
  const router = useRouter();
  const [customer, setCustomer] = useState(null);
  const [allCompanies, setAllCompanies] = useState([]);
  const [customerCompanies, setCustomerCompanies] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [addingOrderForCompany, setAddingOrderForCompany] = useState(null);
  const [newOrder, setNewOrder] = useState({
    name: '',
    size: TILE_SIZES[0],
    grade: GRADES[0],
    boxNumber: '',
    tpRate: '',
    amount: '',
    srNo: 0,
  });
  

  // Group orders by company
  const ordersByCompany = orders.reduce((acc, order) => {
    if (!acc[order.companyId]) {
      acc[order.companyId] = [];
    }
    acc[order.companyId].push(order);
    return acc;
  }, {});

  const loadData = async () => {
    try {
      const [customerData, companiesData, ordersData] = await Promise.all([
        getCustomerById(params.id),
        getCompanies(),
        getCustomerOrders(params.id)
      ]);
      setCustomer(customerData);
      setAllCompanies(companiesData);

      // Extract unique company IDs from orders
      const companyIds = [...new Set(ordersData.map(order => order.companyId))];
      const customerCompanyList = companiesData.filter(company =>
        companyIds.includes(company.id)
      );
      setCustomerCompanies(customerCompanyList);
      setOrders(ordersData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [params.id]);

  const handleAddCompany = async (value) => {
    try {
      // Check if company already exists
      const existingCompany = allCompanies.find(
        company => company.name.toLowerCase() === value.toLowerCase()
      );

      if (existingCompany) {
        // If company exists but not in customer's list, add it to customer companies
        if (!customerCompanies.some(c => c.id === existingCompany.id)) {
          setCustomerCompanies(prev => [...prev, existingCompany]);
        }
        return existingCompany;
      }

      // Add new company
      const newCompany = await addCompany(value);
      setAllCompanies(prev => [...prev, newCompany]);
      setCustomerCompanies(prev => [...prev, newCompany]);
      setNewCompanyName('');
      return newCompany;
    } catch (error) {
      console.error('Error adding company:', error);
      return null;
    }
  };

  const handleCompanySelect = async (value) => {
    // If value doesn't match any existing company, create a new one
    const company = allCompanies.find(c => c.id === value) ||
      await handleAddCompany(value);

    if (company && !customerCompanies.some(c => c.id === company.id)) {
      setCustomerCompanies(prev => [...prev, company]);
    }
  };

  const handleAddOrder = (companyId) => {
    // Calculate the next serial number for this company
    const companyOrders = ordersByCompany[companyId] || [];
    const nextSrNo = companyOrders.length > 0
      ? Math.max(...companyOrders.map(order => order.srNo || 0)) + 1
      : 1;

    setAddingOrderForCompany(companyId);
    setNewOrder({
      name: '',
      size: TILE_SIZES[0],
      grade: GRADES[0],
      boxNumber: '',
      tpRate: '',
      amount: '',
      srNo: nextSrNo, // Auto-assign the next serial number
    });
  };

  const handleOrderChange = (field, value) => {
    setNewOrder(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveOrder = async () => {
    try {
      const orderData = {
        ...newOrder,
        companyId: addingOrderForCompany
      };

      await addOrder(params.id, orderData);
      await loadData();
      setAddingOrderForCompany(null);
    } catch (error) {
      console.error('Error adding order:', error);
    }
  };

  const handleCancelAddOrder = () => {
    setAddingOrderForCompany(null);
  };

  if (loading || !customer) return <Loader className="h-screen"/>


  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button
              variant="ghost"
              size="icon"
              className="border"
            >
              <ArrowLeft className="h-5 w-5 text-gray-300" />
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold tracking-tight">{customer.name}</h1>
            <p className="text-muted-foreground">
              Orders for this customer
            </p>
          </div>
        </div>
      </div>

      {/* Company Selection */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Add Company</h2>
        <div className="flex gap-2 max-w-md">
          <Combobox
            options={allCompanies.map(c => ({ label: c.name, value: c.id }))}
            onSelect={handleCompanySelect}
            onCreateOption={handleAddCompany}
            placeholder="Search or add company..."
            className="flex-1"
          />
        </div>
      </div>

      <div className="space-y-8">
        {customerCompanies.map(company => {
          const companyOrders = ordersByCompany[company.id] || [];

          return (
            <div key={company.id} className="space-y-4">
              <h2 className="text-2xl font-bold">{company.name}</h2>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Sr</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Box Number</TableHead>
                    <TableHead>TP Rate</TableHead>
                    <TableHead>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {companyOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.srNo}</TableCell>
                      <TableCell>{order.name}</TableCell>
                      <TableCell>{order.size}</TableCell>
                      <TableCell>{order.grade}</TableCell>
                      <TableCell>{order.boxNumber}</TableCell>
                      <TableCell>{order.tpRate}</TableCell>
                      <TableCell>{order.amount}</TableCell>
                    </TableRow>
                  ))}

                  {/* Add new order row */}
                  {addingOrderForCompany === company.id ? (
                    <TableRow>
                      {/* Serial Number (auto-generated and displayed) */}
                      <TableCell>
                        {newOrder.srNo}
                      </TableCell>

                      {/* name */}
                      <TableCell>
                        <Input
                          value={newOrder.name}
                          onChange={(e) => handleOrderChange('name', e.target.value)}
                          className="h-8"
                        />
                      </TableCell>

                      {/* size */}
                      <TableCell>
                        <Select
                          value={newOrder.size}
                          onValueChange={(value) => handleOrderChange('size', value)}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {TILE_SIZES.map(size => (
                              <SelectItem key={size} value={size}>
                                {size}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>

                      {/* grade */}
                      <TableCell>
                        <Select
                          value={newOrder.grade}
                          onValueChange={(value) => handleOrderChange('grade', value)}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {GRADES.map(grade => (
                              <SelectItem key={grade} value={grade}>
                                {grade}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>

                      {/* box number */}
                      <TableCell>
                        <Input
                          type="number"
                          value={newOrder.boxNumber}
                          onChange={(e) => handleOrderChange('boxNumber', e.target.value)}
                          className="h-8"
                        />
                      </TableCell>

                      {/* tp rate */}
                      <TableCell>
                        <Input
                          type="number"
                          value={newOrder.tpRate}
                          onChange={(e) => handleOrderChange('tpRate', e.target.value)}
                          className="h-8"
                        />
                      </TableCell>

                      {/* amount */}
                      <TableCell>
                        <Input
                          type="number"
                          value={newOrder.amount}
                          onChange={(e) => handleOrderChange('amount', e.target.value)}
                          className="h-8"
                        />
                      </TableCell>

                      {/* actions */}
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={handleSaveOrder}
                            className="h-7 w-7"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={handleCancelAddOrder}
                            className="h-7 w-7"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9}>
                        <Button
                          variant="ghost"
                          className="w-full flex items-center justify-center py-2"
                          onClick={() => handleAddOrder(company.id)}
                        >
                          <Plus className="h-4 w-4 mr-2" /> Add Order
                        </Button>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          );
        })}

        {customerCompanies.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No companies added yet. Add a company to start creating orders.
          </div>
        )}
      </div>
    </div>
  );
}