import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="container flex flex-col items-center max-w-md text-center space-y-6">
        {/* Icon and Status Code */}
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-muted">
          <AlertCircle className="h-10 w-10 text-muted-foreground" />
        </div>
        
        <h1 className="text-4xl font-bold tracking-tight">404</h1>
        
        {/* Error Messages */}
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">
            Page not found
          </h2>
          <p className="text-muted-foreground">
            We couldn't find the page you were looking for. 
            It might have been removed, renamed, or doesn't exist.
          </p>
        </div>

        {/* Action Button */}
        <Link href="/" className="mt-8">
          <Button size="lg" className="gap-2">
            <Home className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}