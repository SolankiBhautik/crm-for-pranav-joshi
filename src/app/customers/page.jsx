"use client"

import { useRouter } from 'next/navigation';
import CustomerForm from '@/components/customers/customer-form';
import { addCustomer } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewCustomerPage() {
    const router = useRouter();

    const handleSubmit = async (data) => {
        try {
            await addCustomer(data);
            router.push('/');
        } catch (error) {
            console.error('Error adding customer:', error);
        }
    };

    return (
        <div className="container mx-auto py-10">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/" prefetch={true}>
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-4xl font-bold tracking-tight">New Customer</h1>
                    <p className="text-muted-foreground">Add a new customer to the system</p>
                </div>
            </div>
            <div className="max-w-2xl">
                <CustomerForm onSubmit={handleSubmit} />
            </div>
        </div>
    );
}
