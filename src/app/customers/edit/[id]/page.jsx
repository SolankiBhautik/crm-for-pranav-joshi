"use client"

import { getCustomerById, updateCustomer } from '@/lib/customer';
import CustomerForm from '@/components/customers/customer-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { redirect, notFound } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Loading from '@/app/loading';

export default function EditCustomerPage() {
    const params = useParams();
    const id = params.id;

    const [customer, setCustomer] = useState();

    useEffect(() => {
      const run = async  () => {
        const data = await getCustomerById(id);
        setCustomer(data);
      }
      run();
    }, []);


  async function handleSubmit(data)  {
    try {
        await updateCustomer(id, data);
    } catch (error) {
        console.error('Error updating customer:', error);
    }

    // revalidatePath(`/`)
    redirect(`/`)
  };

  if (!customer) {
      return <Loading />
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
      <div >
        <CustomerForm onSubmit={handleSubmit} customer={customer} />
      </div>
    </div>
  );
}
