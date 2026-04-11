"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Building2, LayoutDashboard, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/properties", label: "Properties", icon: Building2 },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, owner } = useAuthStore();

  const handleLogout = () => {
    logout();
    document.cookie = "access_token=; path=/; max-age=0";
    router.push("/login");
  };

  return (
    <aside className="w-60 min-h-screen bg-gray-900 flex flex-col">
      <div className="px-6 py-5 border-b border-gray-800">
        <span className="text-white font-bold text-lg tracking-tight">Corbel</span>
        {owner && <p className="text-gray-400 text-xs mt-1 truncate">{owner.email}</p>}
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                active
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
