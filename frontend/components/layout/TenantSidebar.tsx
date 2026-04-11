"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";

export default function TenantSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, owner } = useAuthStore();

  const handleLogout = () => {
    logout();
    document.cookie = "access_token=; path=/; max-age=0";
    document.cookie = "user_role=; path=/; max-age=0";
    router.push("/login");
  };

  return (
    <aside className="w-60 min-h-screen bg-gray-900 flex flex-col">
      <div className="px-6 py-5 border-b border-gray-800">
        <span className="text-white font-bold text-lg tracking-tight">Corbel</span>
        <div className="mt-1">
          <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">Tenant</span>
        </div>
        {owner && <p className="text-gray-400 text-xs mt-1 truncate">{owner.email}</p>}
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        <Link
          href="/tenant"
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
            pathname === "/tenant"
              ? "bg-blue-600 text-white"
              : "text-gray-400 hover:bg-gray-800 hover:text-white"
          }`}
        >
          <Home size={16} />
          My Unit
        </Link>
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
