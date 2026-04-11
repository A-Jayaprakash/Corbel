"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { propertyApi, PropertyPayload } from "@/lib/queries";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2, ChevronRight, MapPin, Phone, User, X } from "lucide-react";
import Link from "next/link";

const schema = z.object({
  name: z.string().min(2, "Property name is required"),
  ownerName: z.string().optional(),
  phone: z
    .string()
    .regex(/^\+?[0-9]{7,15}$/, "Invalid phone number")
    .optional()
    .or(z.literal("")),
  addressLine1: z.string().min(1, "Address line 1 is required"),
  addressLine2: z.string().optional(),
  location: z.string().min(1, "Location is required"),
  pincode: z.string().regex(/^\d{4,10}$/, "Pincode must be 4–10 digits"),
});

type FormData = z.infer<typeof schema>;

type Property = {
  id: string;
  name: string;
  ownerName?: string;
  phone?: string;
  addressLine1?: string;
  addressLine2?: string;
  location?: string;
  pincode?: string;
};

const Field = ({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) => (
  <div>
    <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
    {children}
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const inputCls =
  "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80";

export default function PropertiesPage() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["properties"],
    queryFn: () => propertyApi.list(),
  });

  const create = useMutation({
    mutationFn: (d: PropertyPayload) => propertyApi.create(d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["properties"] });
      setShowForm(false);
      reset();
    },
  });

  const remove = useMutation({
    mutationFn: propertyApi.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["properties"] }),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const properties: Property[] = data?.data ?? [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
          <p className="text-gray-500 text-sm">{data?.meta?.total ?? 0} total</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          Add property
        </button>
      </div>

      {/* Add Property Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 mx-4">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-gray-900 text-lg">New property</h2>
              <button
                onClick={() => { setShowForm(false); reset(); }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit((d) => create.mutate(d))} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <Field label="Property Name *" error={errors.name?.message}>
                    <input {...register("name")} className={inputCls} placeholder="e.g. Sunrise Apartments" suppressHydrationWarning />
                  </Field>
                </div>
                <Field label="Owner Name" error={errors.ownerName?.message}>
                  <input {...register("ownerName")} className={inputCls} placeholder="Full name" suppressHydrationWarning />
                </Field>
                <Field label="Phone Number" error={errors.phone?.message}>
                  <input {...register("phone")} className={inputCls} placeholder="+91 9999999999" suppressHydrationWarning />
                </Field>
                <div className="col-span-2">
                  <Field label="Address Line 1 *" error={errors.addressLine1?.message}>
                    <input {...register("addressLine1")} className={inputCls} placeholder="Door/Flat no, Street" suppressHydrationWarning />
                  </Field>
                </div>
                <div className="col-span-2">
                  <Field label="Address Line 2" error={errors.addressLine2?.message}>
                    <input {...register("addressLine2")} className={inputCls} placeholder="Area, Landmark (optional)" suppressHydrationWarning />
                  </Field>
                </div>
                <Field label="Location / City *" error={errors.location?.message}>
                  <input {...register("location")} className={inputCls} placeholder="Chennai" suppressHydrationWarning />
                </Field>
                <Field label="Pincode *" error={errors.pincode?.message}>
                  <input {...register("pincode")} className={inputCls} placeholder="600001" suppressHydrationWarning />
                </Field>
              </div>

              {create.error && (
                <p className="text-red-500 text-xs">{String(create.error)}</p>
              )}

              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  disabled={isSubmitting || create.isPending}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {create.isPending ? "Saving..." : "Save property"}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); reset(); }}
                  className="px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Property Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 rounded-2xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-sm">No properties yet. Add your first one above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {properties.map((p) => (
            <PropertyCard key={p.id} property={p} onDelete={() => remove.mutate(p.id)} />
          ))}
        </div>
      )}
    </div>
  );
}

function PropertyCard({ property: p, onDelete }: { property: Property; onDelete: () => void }) {
  return (
    <div
      className="relative rounded-2xl overflow-hidden border border-white/30"
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(219,234,254,0.45) 100%)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        boxShadow: "0 8px 32px 0 rgba(31,38,135,0.10), inset 0 1px 0 rgba(255,255,255,0.6)",
      }}
    >
      {/* Decorative blob */}
      <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-blue-400/20 blur-2xl pointer-events-none" />

      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-gray-900 text-base leading-tight pr-2">{p.name}</h3>
          <button
            onClick={onDelete}
            className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0"
          >
            <Trash2 size={14} />
          </button>
        </div>

        <div className="space-y-1.5 text-xs text-gray-500 mb-4">
          {p.ownerName && (
            <div className="flex items-center gap-1.5">
              <User size={11} className="flex-shrink-0 text-blue-400" />
              <span className="truncate">{p.ownerName}</span>
            </div>
          )}
          {p.phone && (
            <div className="flex items-center gap-1.5">
              <Phone size={11} className="flex-shrink-0 text-blue-400" />
              <span>{p.phone}</span>
            </div>
          )}
          {(p.addressLine1 || p.location) && (
            <div className="flex items-start gap-1.5">
              <MapPin size={11} className="flex-shrink-0 text-blue-400 mt-0.5" />
              <span className="line-clamp-2">
                {[p.addressLine1, p.addressLine2, p.location, p.pincode]
                  .filter(Boolean)
                  .join(", ")}
              </span>
            </div>
          )}
        </div>

        <Link
          href={`/properties/${p.id}`}
          className="flex items-center justify-between w-full px-3 py-1.5 rounded-lg text-xs font-medium text-blue-700 bg-blue-50/80 hover:bg-blue-100/80 transition-colors"
        >
          View units
          <ChevronRight size={13} />
        </Link>
      </div>
    </div>
  );
}
