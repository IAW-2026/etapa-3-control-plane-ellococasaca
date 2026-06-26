"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Truck,
  ShoppingCart,
  Store,
  CircleDollarSign,
  MessageSquare,
  Users,
  Settings,
  BarChart2,
} from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number }>;
};

const generalItems: NavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
];

const appItems: NavItem[] = [
  { label: "Shipping", href: "/shipping", icon: Truck },
  { label: "Buyer", href: "/buyer", icon: ShoppingCart },
  { label: "Seller", href: "/seller", icon: Store },
  { label: "Payments", href: "/payments", icon: CircleDollarSign },
  { label: "Feedback", href: "/feedback", icon: MessageSquare },
];

const systemItems: NavItem[] = [
  { label: "Usuarios", href: "/usuarios", icon: Users },
  { label: "Configuración", href: "/configuracion", icon: Settings },
];

function SidebarSection({
  title,
  items,
  pathname,
}: {
  title: string;
  items: NavItem[];
  pathname: string;
}) {
  return (
    <div className="mb-6">
      <div className="px-3 mb-2 text-[10px] font-medium uppercase tracking-wider text-slate-500">
        {title}
      </div>
      <ul className="space-y-0.5">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive
                    ? "bg-red-600 text-white font-medium"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function Sidebar({ dashboardUrl }: { dashboardUrl?: string }) {
  const pathname = usePathname();

  return (
    <aside className="w-60 bg-slate-900 text-white border-r border-slate-800 flex flex-col h-screen shrink-0">
      <div className="px-5 py-5 border-b border-slate-800">
        <div className="text-sm font-medium text-white">El Loco Casaca</div>
        <div className="text-xs text-slate-400 mt-0.5">Control Plane</div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <SidebarSection title="General" items={generalItems} pathname={pathname} />
        <SidebarSection title="Aplicaciones" items={appItems} pathname={pathname} />
        <SidebarSection title="Sistema" items={systemItems} pathname={pathname} />
      </nav>

      {dashboardUrl && (
        <div className="px-3 py-3 border-t border-slate-800">
          <a
            href={dashboardUrl}
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors w-full"
          >
            <BarChart2 size={16} />
            Dashboard Analytics
          </a>
        </div>
      )}

      <div className="px-5 py-3 border-t border-slate-800 text-xs text-slate-500">
        v0.1
      </div>
    </aside>
  );
}