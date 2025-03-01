import { Geist } from "next/font/google";
import { AuthProvider } from "@/context/auth-context";
import "./globals.css";

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
      <body className={`${geist.variable} font-sans antialiased bg-background text-primary`}>
          <AuthProvider>
            {children}
          </AuthProvider>
      </body>
    </html>
  );
}
