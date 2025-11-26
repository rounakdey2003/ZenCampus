"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users,
  Wrench,
  AlertTriangle,
  Settings,
  LogOut,
  ShieldCheck,
  MessageSquare,
  Coffee,
  Droplet,
  Package,
  Bell,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const adminNavItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    label: "Students",
    href: "/admin/students",
    icon: <Users className="w-5 h-5" />,
  },
  {
    label: "Complaints",
    href: "/admin/complaints",
    icon: <AlertTriangle className="w-5 h-5" />,
  },
  {
    label: "Maintenance",
    href: "/admin/maintenance",
    icon: <Wrench className="w-5 h-5" />,
  },
  {
    label: "Laundry",
    href: "/admin/laundry",
    icon: <Droplet className="w-5 h-5" />,
  },
  {
    label: "Cleaning",
    href: "/admin/cleaning",
    icon: <Package className="w-5 h-5" />,
  },
  {
    label: "Canteen",
    href: "/admin/canteen",
    icon: <Coffee className="w-5 h-5" />,
  },
  {
    label: "Forum",
    href: "/admin/forum",
    icon: <MessageSquare className="w-5 h-5" />,
  },
  {
    label: "Notices",
    href: "/admin/notices",
    icon: <Bell className="w-5 h-5" />,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: <Settings className="w-5 h-5" />,
  },
];

export function AdminSidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  return (
    <aside className={cn("w-72 bg-background flex-col h-screen sticky top-0 p-4 hidden lg:flex", onClose && "flex h-full static")}>
      <div className="px-4 py-6 mb-6">
        <Link href="/admin">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground">Admin Panel</h1>
              <p className="text-xs text-muted-foreground">ZenCampus Management</p>
            </div>
          </div>
        </Link>
      </div>

      <div className="px-4 mb-6">
        <div className="p-4 bg-secondary/30 rounded-xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-primary" />
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-foreground truncate">{session?.user?.name || "Administrator"}</p>
            <p className="text-xs text-muted-foreground truncate">{session?.user?.usn || "ADMIN"}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto space-y-1">
        {adminNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200",
              pathname === item.href
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            )}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto pt-6">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
