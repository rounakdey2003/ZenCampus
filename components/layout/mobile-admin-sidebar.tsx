"use client";

import { Menu } from "lucide-react";
import { useState } from "react";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { cn } from "@/lib/utils";

export function MobileAdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden p-4 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-background transform transition-transform duration-300 ease-in-out lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <AdminSidebar onClose={() => setIsOpen(false)} />
      </div>
    </>
  );
}
