import { MobileAdminSidebar } from "@/components/layout/mobile-admin-sidebar";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { SessionProvider } from "next-auth/react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <div className="flex min-h-screen bg-gray-50 flex-col lg:flex-row">
        <div className="lg:hidden bg-white border-b p-4 flex items-center gap-4 sticky top-0 z-30">
          <MobileAdminSidebar />
          <span className="font-bold text-lg">ZenCampus Admin</span>
        </div>
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </SessionProvider>
  );
}
