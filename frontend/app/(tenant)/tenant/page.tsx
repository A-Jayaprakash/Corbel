"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Building2, Home, Phone, Mail, User, MapPin } from "lucide-react";

type TenantMe = {
  tenant: { id: string; name: string; email: string; phone: string; tenancyStartDate: string };
  unit: { id: string; unitName: string; monthlyRent: number; advanceAmount: number } | null;
  property: { id: string; name: string; addressLine1: string; addressLine2?: string; location: string; pincode: string } | null;
  owner: { name: string; email: string; phone?: string } | null;
};

export default function TenantDashboard() {
  const { data, isLoading, error } = useQuery<TenantMe>({
    queryKey: ["tenant-me"],
    queryFn: () => api.get("/tenant/me").then((r) => r.data),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => <div key={i} className="h-36 rounded-2xl bg-gray-100 animate-pulse" />)}
      </div>
    );
  }

  if (error || !data) {
    return <p className="text-red-500 text-sm">Failed to load your details. Please try again.</p>;
  }

  const { tenant, unit, property, owner } = data;

  const glassCard = {
    background: "linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(219,234,254,0.45) 100%)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    boxShadow: "0 8px 32px 0 rgba(31,38,135,0.10), inset 0 1px 0 rgba(255,255,255,0.6)",
  } as React.CSSProperties;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Hello, {tenant.name}</h1>
      <p className="text-gray-500 text-sm mb-8">
        Tenant since {new Date(tenant.tenancyStartDate).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Unit card */}
        <div className="rounded-2xl border border-white/30 p-5 relative overflow-hidden" style={glassCard}>
          <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-blue-400/20 blur-2xl pointer-events-none" />
          <div className="flex items-center gap-2 mb-4">
            <Home size={16} className="text-blue-500" />
            <h2 className="font-semibold text-gray-800 text-sm">Your Unit</h2>
          </div>
          {unit ? (
            <div className="space-y-2">
              <p className="text-2xl font-bold text-gray-900">{unit.unitName}</p>
              <p className="text-sm text-gray-500">Monthly Rent: <span className="font-semibold text-gray-800">₹{unit.monthlyRent.toLocaleString()}</span></p>
              <p className="text-sm text-gray-500">Advance: <span className="font-semibold text-gray-800">₹{unit.advanceAmount.toLocaleString()}</span></p>
            </div>
          ) : <p className="text-gray-400 text-sm">No unit assigned</p>}
        </div>

        {/* Property card */}
        <div className="rounded-2xl border border-white/30 p-5 relative overflow-hidden" style={glassCard}>
          <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-purple-400/20 blur-2xl pointer-events-none" />
          <div className="flex items-center gap-2 mb-4">
            <Building2 size={16} className="text-purple-500" />
            <h2 className="font-semibold text-gray-800 text-sm">Property</h2>
          </div>
          {property ? (
            <div className="space-y-1.5">
              <p className="font-bold text-gray-900">{property.name}</p>
              <div className="flex items-start gap-1.5 text-sm text-gray-500">
                <MapPin size={13} className="text-purple-400 mt-0.5 flex-shrink-0" />
                <span>{[property.addressLine1, property.addressLine2, property.location, property.pincode].filter(Boolean).join(", ")}</span>
              </div>
            </div>
          ) : <p className="text-gray-400 text-sm">No property details</p>}
        </div>

        {/* Owner contact card */}
        <div className="rounded-2xl border border-white/30 p-5 relative overflow-hidden md:col-span-2" style={glassCard}>
          <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-green-400/20 blur-2xl pointer-events-none" />
          <div className="flex items-center gap-2 mb-4">
            <User size={16} className="text-green-500" />
            <h2 className="font-semibold text-gray-800 text-sm">Owner Contact</h2>
          </div>
          {owner ? (
            <div className="flex flex-wrap gap-6">
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Name</p>
                <p className="font-semibold text-gray-900">{owner.name}</p>
              </div>
              <a href={`mailto:${owner.email}`} className="group">
                <p className="text-xs text-gray-400 mb-0.5">Email</p>
                <div className="flex items-center gap-1.5 text-blue-600 group-hover:underline">
                  <Mail size={13} />
                  <span className="text-sm font-medium">{owner.email}</span>
                </div>
              </a>
              {owner.phone && (
                <a href={`tel:${owner.phone}`} className="group">
                  <p className="text-xs text-gray-400 mb-0.5">Phone</p>
                  <div className="flex items-center gap-1.5 text-blue-600 group-hover:underline">
                    <Phone size={13} />
                    <span className="text-sm font-medium">{owner.phone}</span>
                  </div>
                </a>
              )}
            </div>
          ) : <p className="text-gray-400 text-sm">No owner contact available</p>}
        </div>
      </div>
    </div>
  );
}
