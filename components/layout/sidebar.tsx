"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Droplet, 
  Wind, 
  Wrench, 
  Zap, 
  Hammer, 
  Droplets,
  Package,
  Bath,
  Home,
  Coffee,
  MessageSquare,
  AlertTriangle,
  BarChart3,
  FileText,
  LogOut,
  ChevronDown,
  User,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";

interface NavItem {
  label: string;
  href?: string;
  icon: React.ReactNode;
  items?: { label: string; href: string; icon: React.ReactNode }[];
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    label: "ZenWash",
    icon: <Droplet className="w-5 h-5" />,
    items: [
      { label: "Washing", href: "/washing?tab=washing", icon: <Droplet className="w-4 h-4" /> },
      { label: "Dryer", href: "/washing?tab=dryer", icon: <Wind className="w-4 h-4" /> },
    ],
  },
  {
    label: "ZenMaintenance",
    icon: <Wrench className="w-5 h-5" />,
    items: [
      { label: "Electrical", href: "/maintenance?tab=electrical", icon: <Zap className="w-4 h-4" /> },
      { label: "Carpentry", href: "/maintenance?tab=carpentry", icon: <Hammer className="w-4 h-4" /> },
      { label: "Plumbing", href: "/maintenance?tab=plumbing", icon: <Droplets className="w-4 h-4" /> },
    ],
  },
  {
    label: "ZenCleaning",
    icon: <Package className="w-5 h-5" />,
    items: [
      { label: "Room", href: "/room?tab=room", icon: <Home className="w-4 h-4" /> },
      { label: "Bathroom", href: "/room?tab=bathroom", icon: <Bath className="w-4 h-4" /> },
    ],
  },
  {
    label: "ZenCanteen",
    icon: <Coffee className="w-5 h-5" />,
    items: [
      { label: "New Booking", href: "/canteen?tab=menu", icon: <Coffee className="w-4 h-4" /> },
      { label: "Orders", href: "/canteen?tab=orders", icon: <FileText className="w-4 h-4" /> },
    ],
  },
  {
    label: "ZenStudent",
    icon: <MessageSquare className="w-5 h-5" />,
    items: [
      { label: "Discussions", href: "/student?tab=discussions", icon: <MessageSquare className="w-4 h-4" /> },
      { label: "Warden Complaints", href: "/student?tab=warden", icon: <AlertTriangle className="w-4 h-4" /> },
      { label: "Polls", href: "/student?tab=polls", icon: <BarChart3 className="w-4 h-4" /> },
    ],
  },
  {
    label: "ZenNotice",
    href: "/notice",
    icon: <FileText className="w-5 h-5" />,
  },
  {
    label: "My Profile",
    href: "/profile",
    icon: <User className="w-5 h-5" />,
  },
];

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    );
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  const isLinkActive = (href: string) => {
    const [linkPath, linkQuery] = href.split('?');
    const currentTab = searchParams.get('tab');
    const linkTab = linkQuery ? new URLSearchParams(linkQuery).get('tab') : null;
    
    return pathname === linkPath && currentTab === linkTab;
  };

  return (
    <aside className={cn("w-72 bg-background flex-col h-screen sticky top-0 p-4 hidden lg:flex", onClose && "flex h-full static")}>
      <div className="px-4 py-6 mb-6">
        <Link href="/dashboard">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Zen<span className="text-primary/60">Campus</span>
          </h1>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto space-y-1">
        {navItems.map((item, index) => (
          <div key={index}>
            {item.href ? (
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200",
                  isLinkActive(item.href)
                    ? "bg-secondary text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ) : (
              <>
                <button
                  onClick={() => toggleExpand(item.label)}
                  className={cn(
                    "w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200",
                    "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 transition-transform duration-200",
                      expandedItems.includes(item.label) && "rotate-180"
                    )}
                  />
                </button>
                {expandedItems.includes(item.label) && item.items && (
                  <div className="ml-4 mt-1 space-y-1 border-l border-border/50 pl-2">
                    {item.items.map((subItem) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className={cn(
                          "flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                          isLinkActive(subItem.href)
                            ? "text-primary bg-secondary/50"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
                        )}
                      >
                        {subItem.icon}
                        <span>{subItem.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
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
