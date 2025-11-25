import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ZenCampus - Smart Campus Management System",
  description:
    "Book laundry, cleaners & complaints — instantly. Manage your campus services efficiently.",
  keywords: [
    "campus management",
    "hostel management",
    "laundry booking",
    "maintenance complaints",
    "canteen orders",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.variable, "font-sans antialiased")}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
