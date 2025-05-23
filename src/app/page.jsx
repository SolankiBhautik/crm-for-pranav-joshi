"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { getCustomers, getCities, getStates } from '@/lib/customer';
import CustomerTable from '@/components/customers/customer-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  PlusCircle,
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  CalendarIcon,
  Download
} from 'lucide-react';
import LoginForm from '@/components/auth/login-form';
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Loader from '@/components/Loader';
import { STATUS } from '@/utils/constants';

export default function HomePage() {

  const { isAuthenticated } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search and filter states  
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    city: '',
    state: '',
  });

  const [dateRange, setDateRange] = useState({
    start: null,
    end: null,
  });


  // Sorting state
  const [sortConfig, setSortConfig] = useState({
    key: 'name',
    direction: 'asc'
  });

  // Dropdown options (to be populated from data)
  const [filterOptions, setFilterOptions] = useState({
    cities: [],
    states: [],
  });

  const fetchFilterOptions = async () => {
    try {
      const cities = await getCities();
      setFilterOptions((oldFilterOptions) => ({
        ...oldFilterOptions,
        cities, //
      }));

      const states = await getStates();
      setFilterOptions((oldFilterOptions) => ({
        ...oldFilterOptions,
        states,
      }));
    } catch (error) {
      console.error(error);
    }
  };


  // Function to fetch data with current filters
  const fetchCustomers = async () => {
    setLoading(true);
    const filterOptions = {
      searchTerm,
      ...filters,
      dateRange,
      sortBy: sortConfig.key,
      sortDirection: sortConfig.direction
    };

    const data = await getCustomers(filterOptions);
    setCustomers(data);

    // Extract unique cities and states for filter dropdowns
    if (data.length > 0) {
      const cities = [...new Set(data.filter(c => c.city).map(c => c.city))];
      const states = [...new Set(data.filter(c => c.state).map(c => c.state))];
      setFilterOptions({ cities, states });
    }

    setLoading(false);
  };

  // Fetch when filters or search changes
  useEffect(() => {
    if (isAuthenticated) {
      const debounce = setTimeout(() => {
        fetchCustomers();
      }, 300);
      return () => clearTimeout(debounce);
    }
  }, [searchTerm, filters, dateRange, sortConfig, isAuthenticated]);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      type: '',
      status: '',
      city: '',
      state: '',
    });
    setDateRange({
      start: null,
      end: null,
    });
    setSearchTerm('');
  };

  // Handle sorting
  const requestSort = (key) => {
    setSortConfig(prevSortConfig => {
      if (prevSortConfig.key === key) {
        return {
          key: key,
          direction: prevSortConfig.direction === 'asc' ? 'desc' : 'asc',
        };
      }
      return { key: key, direction: 'asc' };
    });
  };


  const exportToCSV = () => {
    const headers = ['Name', 'Type', 'City', 'Reference', 'Date', 'Status'];

    const csvData = customers.map(customer => [
      customer.name || '',
      customer.type || '',
      customer.city || '-',
      customer.reference || '-',
      customer.date ? `${format(new Date(customer.date.seconds * 1000), 'dd-MM-yyyy')}` : '-',
      customer.status || '-'
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `customers-export-${format(new Date(), 'dd-MM-yyyy')}.csv`);
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };


  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoginForm />
      </div>
    );
  }

  // Count active filters
  const activeFilterCount = Object.values(filters).filter(value =>
    value !== '' && value !== null
  ).length;

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground">
            Manage your customer relationships and orders
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportToCSV} disabled={customers.length === 0 || loading}>
            <Download className="mr-2 h-5 w-5" />
            Export
          </Button>
          <Link href="/customers" prefetch={true}>
            <Button>
              <PlusCircle className="mr-2 h-6 w-6" />
              Add Customer
            </Button>
          </Link>
        </div>
      </div>

      {/* Search and Filter UI */}
      <div className="space-y-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                onClick={() => setSearchTerm('')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={`${showFilters && 'border-primary'} ${activeFilterCount > 0 ? 'border-primary' : ''}`}
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Sort by: {sortConfig.key.charAt(0).toUpperCase() + sortConfig.key.slice(1)}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => requestSort('name')}>
                Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => requestSort('date')}>
                Date {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => requestSort('city')}>
                City {sortConfig.key === 'city' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => requestSort('type')}>
                Type {sortConfig.key === 'type' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <Card className="border border-border">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                {/* Type filter */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between h-8">
                    <Label>Customer Type</Label>
                    {filters.type && (
                      <Button
                        variant="outline"
                        size='sm'
                        onClick={() => handleFilterChange('type', '')}
                        className="rounded hover:bg-accent"
                        title='Clear selection'
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Clear selection</span>
                      </Button>
                    )}
                  </div>
                  <Select
                    value={filters.type}
                    onValueChange={(value) => handleFilterChange('type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BUILDER">Builder</SelectItem>
                      <SelectItem value="BUNGLOW">Bunglow</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* status filter */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between h-8">
                    <Label>Status</Label>
                    {filters.status && (
                      <Button
                        variant="outline"
                        size='sm'
                        onClick={() => handleFilterChange('status', '')}
                        className="rounded hover:bg-accent"
                        title='Clear selection'
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Clear selection</span>
                      </Button>
                    )}
                  </div>
                  <Select
                    value={filters.status}
                    onValueChange={(value) => handleFilterChange("status", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All status" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS.map(ele => {
                        return <SelectItem key={ele.key} value={ele.key}>{ele.value}</SelectItem>
                      })}
                    </SelectContent>
                  </Select>
                </div>

                {/* City filter */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between h-8">
                    <Label>City</Label>
                    {filters.city && (
                      <Button
                        variant="outline"
                        size='sm'
                        onClick={() => handleFilterChange('city', '')}
                        className="rounded hover:bg-accent"
                        title='Clear selection'
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Clear selection</span>
                      </Button>
                    )}
                  </div>
                  <Select
                    value={filters.city}
                    onValueChange={(value) => handleFilterChange('city', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All cities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All cities</SelectItem>
                      {filterOptions.cities.map(city => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* State filter */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between h-8">
                    <Label>State</Label>
                    {filters.state && (
                      <Button
                        variant="outline"
                        size='sm'
                        onClick={() => handleFilterChange('state', '')}
                        className="rounded hover:bg-accent"
                        title='Clear selection'
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Clear selection</span>
                      </Button>
                    )}
                  </div>
                  <Select
                    value={filters.state}
                    onValueChange={(value) => handleFilterChange('state', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All states" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All states</SelectItem>
                      {filterOptions.states.map(state => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Date range filter */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between h-8">
                    <Label>Date Range</Label>
                    {(dateRange.from || dateRange.to) && (
                      <Button
                        variant="outline"
                        size='sm'
                        onClick={() => setDateRange({ start: null, end: null })}
                        className="rounded hover:bg-accent"
                        title='Clear selection'
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Clear selection</span>
                      </Button>
                    )}
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.from ? (
                          dateRange.to ? (
                            `${format(dateRange.from, "PPP")} - ${format(dateRange.to, "PPP")}`
                          ) : (
                            format(dateRange.from, "PPP")
                          )
                        ) : (
                          <span>Pick a date range</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange.from}
                        selected={dateRange}
                        onSelect={(range) => {
                          setDateRange(range);
                        }}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              {activeFilterCount > 0 && (
                <div className='mt-4'>
                  <Button variant="outline" size="sm" onClick={clearFilters}>
                    <X className="h-4 w-4" />
                    Clear filters
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Customer Table */}
      {customers && customers.length !== 0 ? (
        <CustomerTable
          initialCustomers={customers}
          loading={loading}
          sortConfig={sortConfig}
          onSort={requestSort}
        />
      ) : (
        <div className="flex flex-col items-center justify-center space-y-4 p-8 border rounded-lg">
          <div className="text-muted-foreground text-center">
            {loading ? <Loader /> : "No customers found"}
          </div>
          {!loading && (
            <Link href="/customers" prefetch={true}>
              <Button>
                <PlusCircle className="mr-2 h-6 w-6" />
                Add Customer
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}