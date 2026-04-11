"use client";

import { useQuery } from "@tanstack/react-query";
import { propertyApi } from "@/lib/queries";
import { Building2, Home, Users, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["properties"],
    queryFn: () => propertyApi.list(1, 100),
  });

  const properties = data?.data ?? [];
  const total = data?.meta?.total ?? 0;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Dashboard</h1>
      <p className="text-gray-500 text-sm mb-8">Overview of your portfolio</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard icon={Building2} label="Properties" value={total} color="blue" loading={isLoading} />
        <StatCard icon={Home} label="Units" value="—" color="green" loading={isLoading} />
        <StatCard icon={Users} label="Active Tenants" value="—" color="purple" loading={isLoading} />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Recent Properties</h2>
          <Link href="/properties" className="text-sm text-blue-600 hover:underline">
            View all
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <AlertCircle size={32} className="mx-auto mb-2 opacity-40" />
            <p className="text-sm">No properties yet.</p>
            <Link href="/properties" className="text-blue-600 text-sm hover:underline mt-1 inline-block">
              Add your first property
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {properties.slice(0, 5).map((p: { id: string; name: string; address: string }) => (
              <Link
                key={p.id}
                href={`/properties/${p.id}`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                    {p.name}
                  </p>
                  <p className="text-xs text-gray-400">{p.address}</p>
                </div>
                <span className="text-gray-300 group-hover:text-blue-400 text-lg">&rsaquo;</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  loading,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: "blue" | "green" | "purple";
  loading: boolean;
}) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className={`inline-flex p-2 rounded-lg mb-3 ${colors[color]}`}>
        <Icon size={18} />
      </div>
      <p className="text-2xl font-bold text-gray-900">
        {loading ? <span className="block h-7 w-12 bg-gray-100 rounded animate-pulse" /> : value}
      </p>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
    </div>
  );
}
