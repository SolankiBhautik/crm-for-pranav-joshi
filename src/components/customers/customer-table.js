import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Pencil, Trash2, Eye, ChevronUp, ChevronDown } from "lucide-react";
import { deleteCustomer } from "@/lib/db";
import Link from "next/link";
import { formatDate } from '@/utils/functions';

export default function CustomerTable({ initialCustomers, loading, sortConfig, onSort }) {
  const [customers, setCustomers] = useState(initialCustomers);

  // Update customers when initialCustomers changes
  useEffect(() => {
    setCustomers(initialCustomers);
  }, [initialCustomers]);

  const handleDelete = async (customerId) => {
    try {
      await deleteCustomer(customerId);
      setCustomers((prevCustomers) =>
        prevCustomers.filter((customer) => customer.id !== customerId)
      );
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  // Get sort icon for column header
  const getSortIcon = (columnName) => {
    if (!sortConfig) return null;

    if (sortConfig.key === columnName) {
      return sortConfig.direction === 'asc'
        ? <ChevronUp className="h-4 w-4 ml-1" />
        : <ChevronDown className="h-4 w-4 ml-1" />;
    }
    return null;
  };

  if (loading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              className="cursor-pointer hover:text-primary"
              onClick={() => onSort('name')}
            >
              <div className="flex items-center">
                Name
                {getSortIcon('name')}
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer hover:text-primary"
              onClick={() => onSort('type')}
            >
              <div className="flex items-center">
                Type
                {getSortIcon('type')}
              </div>
            </TableHead>
            <TableHead>Mobile</TableHead>
            <TableHead
              className="cursor-pointer hover:text-primary"
              onClick={() => onSort('city')}
            >
              <div className="flex items-center">
                City
                {getSortIcon('city')}
              </div>
            </TableHead>
            <TableHead>Reference</TableHead>
            <TableHead
              className="cursor-pointer hover:text-primary"
              onClick={() => onSort('date')}
            >
              <div className="flex items-center">
                Date
                {getSortIcon('date')}
              </div>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow
              key={customer.id}
              className="cursor-pointer hover:bg-muted/50">
              <TableCell className="font-medium">{customer.name}</TableCell>
              <TableCell>
                <Badge variant='secondary'>
                  {customer.type}
                </Badge>
              </TableCell>
              <TableCell>{customer.mobile ? customer.mobile : '-'}</TableCell>
              <TableCell>{customer.city ? customer.city : '-'}</TableCell>
              <TableCell>{customer.reference ? customer.reference : '-'}</TableCell>
              <TableCell>{customer.date ? formatDate(customer.date) : '-'}</TableCell>
              <TableCell className="actions text-right">
                <div className="flex items-center justify-end space-x-2">
                  <Link href={`/customers/${customer.id}`}>
                    <Button
                      variant="ghost"
                      size="icon"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href={`/customers/edit/${customer.id}`}>
                    <Button
                      variant="ghost"
                      size="icon"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Customer</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete {customer.name}? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(customer.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}