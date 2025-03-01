
import { getCustomerById, updateCustomer } from '@/lib/db';
import CustomerForm from '@/components/customers/customer-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { redirect, notFound } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import Link from 'next/link';

export default async function EditCustomerPage({ params }) {
    const id = (await params).id;
    const customer = await getCustomerById(id);
    const plainCustomer = {
        ...customer,
        visitFactory: customer.visitFactory?.seconds ? new Date(customer.visitFactory.seconds * 1000).toISOString() : null,
        date: customer.date?.seconds ? new Date(customer.date.seconds * 1000).toISOString() : null,
    };


  async function handleSubmit(data)  {
    'use server'
    try {
        await updateCustomer(id, data);
    } catch (error) {
        console.error('Error updating customer:', error);
    }

    revalidatePath(`/`)
    redirect(`/`)
  };

  if (!customer) {
      return notFound()
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/">
            <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
            </Button>
        </Link>
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Edit Customer</h1>
          <p className="text-muted-foreground">
            Update information for {customer.name}
          </p>
        </div>
      </div>
      <div className="max-w-2xl">
            <CustomerForm onSubmit={handleSubmit} initialData={plainCustomer} />
      </div>
    </div>
  );
}
