"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { propertyApi } from "@/lib/queries";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2, Building2, ChevronRight } from "lucide-react";
import Link from "next/link";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
});
type FormData = z.infer<typeof schema>;

export default function PropertiesPage() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["properties"],
    queryFn: () => propertyApi.list(),
  });

  const create = useMutation({
    mutationFn: propertyApi.create,
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
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const properties = data?.data ?? [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
          <p className="text-gray-500 text-sm">{data?.meta?.total ?? 0} total</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          Add property
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit((d) => create.mutate(d))}
          className="bg-white border border-gray-200 rounded-xl p-5 mb-6 space-y-3"
        >
          <h2 className="font-semibold text-gray-900 text-sm">New property</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input
                {...register("name")}
                placeholder="Property name"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <input
                {...register("address")}
                placeholder="Address"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.address && (
                <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={create.isPending}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {create.isPending ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Building2 size={36} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">No properties yet. Add your first one above.</p>
          </div>
        ) : (
          properties.map((p: { id: string; name: string; address: string }) => (
            <div key={p.id} className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 group">
              <Link href={`/properties/${p.id}`} className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 truncate">
                  {p.name}
                </p>
                <p className="text-xs text-gray-400 truncate">{p.address}</p>
              </Link>
              <div className="flex items-center gap-2 ml-4">
                <Link
                  href={`/properties/${p.id}`}
                  className="text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <ChevronRight size={16} />
                </Link>
                <button
                  onClick={() => remove.mutate(p.id)}
                  className="text-gray-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
