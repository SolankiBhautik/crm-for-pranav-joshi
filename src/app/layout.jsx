import { Geist } from "next/font/google";
import { AuthProvider } from "@/context/auth-context";
import "./globals.css";
import  { Toaster } from 'react-hot-toast';

const geist = Geist({   
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata = {
  title: "CRM Dashboard",
  description: "Customer Relationship Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body className={`${geist.variable} font-sans antialiased bg-background text-primary`}>
          <AuthProvider>
            {children}
          </AuthProvider>
        <Toaster  
          toastOptions={{
            className: 'backdrop-blur-md',
            style: {
              background: "hsl(var(--primary) / .05)",
              color: "hsl(var(--primary))",
            },
          }}
          />
      </body>
    </html>
  );
}
