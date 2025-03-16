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
import { Pencil, Trash2, Eye, ChevronUp, ChevronDown, Plus, FileText } from "lucide-react";
import { deleteCustomer } from "@/lib/customer";
import Link from "next/link";
import { formatDate } from '@/utils/functions';
import Loader from '@/components/Loader';

export default function CustomerTable({ initialCustomers, loading, sortConfig, onSort }) {
  const [customers, setCustomers] = useState(initialCustomers);
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
    return <Loader className="h-96" />;
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            {/* Name */}
            <TableHead
              className="cursor-pointer hover:text-primary"
              onClick={() => onSort('name')}
            >
              <div className="flex items-center">
                Name
                {getSortIcon('name')}
              </div>
            </TableHead>

            {/* Type */}
            <TableHead
              className="cursor-pointer hover:text-primary"
              onClick={() => onSort('type')}
            >
              <div className="flex items-center">
                Type
                {getSortIcon('type')}
              </div>
            </TableHead>

            {/* City */}
            <TableHead
              className="cursor-pointer hover:text-primary"
              onClick={() => onSort('city')}
            >
              <div className="flex items-center">
                City
                {getSortIcon('city')}
              </div>
            </TableHead>

            {/* Reference */}
            <TableHead>Reference</TableHead>

            {/* Date */}
            <TableHead
              className="cursor-pointer hover:text-primary"
              onClick={() => onSort('date')}
            >
              <div className="flex items-center">
                Date
                {getSortIcon('date')}
              </div>
            </TableHead>

            {/* Status */}
            <TableHead
              className="cursor-pointer hover:text-primary"
              onClick={() => onSort('status')}
            >
              <div className="flex items-center">
                Status
                {getSortIcon('status')}
              </div>
            </TableHead>

            {/* Actions */}
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow
              key={customer.id}
              className="hover:bg-muted/50">
              <TableCell className="font-medium">{customer.name}</TableCell>
              <TableCell>
                <Badge variant='secondary'>
                  {customer.type}
                </Badge>
              </TableCell>
              <TableCell>{customer.city ? customer.city : '-'}</TableCell>
              <TableCell>{customer.reference ? customer.reference : '-'}</TableCell>
              <TableCell>{customer.date ? formatDate(customer.date) : '-'}</TableCell>
              <TableCell>{customer.status ? customer.status : '-'}</TableCell>
              <TableCell className="actions text-right">
                <div className="flex items-center justify-end">

                  {/* make invoice */}
                  <div>
                    <Link href={`/customers/invoice/${customer.id}`} title="make invoice">
                      <Button
                        variant="ghost"
                        size="icon"
                        tabIndex={-1}
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>

                  <span className="w-[2px] h-6 bg-muted rounded"></span>

                  {/* add order */}
                  <div>
                    <Link href={`/customers/order/${customer.id}`} title="Add Order">
                      <Button
                        variant="ghost"
                        size="icon"
                        tabIndex={-1}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>

                  <span className="w-[2px] h-6 bg-muted rounded"></span>

                  {/* view */}
                  <div>
                    <Link href={`/customers/${customer.id}`} title="View customer">
                      <Button
                        variant="ghost"
                        size="icon"
                        tabIndex={-1}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>

                  <span className="w-[2px] h-6 bg-muted rounded"></span>

                  {/* edit */}
                  <div>
                    <Link href={`/customers/edit/${customer.id}`} title="Edit customer">
                      <Button
                        variant="ghost"
                        size="icon"
                        tabIndex={-1}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>

                  <span className="w-[2px] h-6 bg-muted rounded"></span>

                  {/* delete */}
                  <div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={(e) => e.stopPropagation()}
                          title="Delete customer"
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
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}