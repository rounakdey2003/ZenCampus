"use client";

import { SessionProvider } from "next-auth/react";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <div className="flex h-screen bg-gray-50 flex-col lg:flex-row">
        <div className="lg:hidden bg-white border-b p-4 flex items-center gap-4 sticky top-0 z-30">
          <Suspense fallback={<Loader2 className="animate-spin w-5 h-5" />}>
            <MobileSidebar />
          </Suspense>
          <span className="font-bold text-lg">ZenCampus</span>
        </div>
        <Suspense fallback={<div className="w-72 bg-background p-4 flex items-center justify-center"><Loader2 className="animate-spin w-6 h-6" /></div>}>
          <Sidebar />
        </Suspense>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </SessionProvider>
  );
}
