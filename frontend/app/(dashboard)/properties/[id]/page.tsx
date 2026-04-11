"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { unitApi } from "@/lib/queries";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2, Home, ArrowLeft } from "lucide-react";
import Link from "next/link";

const schema = z.object({
  unitName: z.string().min(1, "Unit name is required"),
  monthlyRent: z.string().refine((v) => Number(v) > 0, "Must be positive"),
  advanceAmount: z.string().refine((v) => Number(v) >= 0, "Must be 0 or more"),
});
type FormData = z.infer<typeof schema>;

const statusColor: Record<string, string> = {
  VACANT: "bg-green-100 text-green-700",
  OCCUPIED: "bg-blue-100 text-blue-700",
};

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["units", id],
    queryFn: () => unitApi.list(id),
  });

  const create = useMutation({
    mutationFn: (d: FormData) =>
      unitApi.create(id, {
        unitName: d.unitName,
        monthlyRent: Number(d.monthlyRent),
        advanceAmount: Number(d.advanceAmount),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["units", id] });
      setShowForm(false);
      reset();
    },
  });

  const remove = useMutation({
    mutationFn: unitApi.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["units", id] }),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const units = data?.data ?? [];

  return (
    <div>
      <Link
        href="/properties"
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-5"
      >
        <ArrowLeft size={14} />
        Properties
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Units</h1>
          <p className="text-gray-500 text-sm">{data?.meta?.total ?? 0} total</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          Add unit
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit((d) => create.mutate(d))}
          className="bg-white border border-gray-200 rounded-xl p-5 mb-6 space-y-3"
        >
          <h2 className="font-semibold text-gray-900 text-sm">New unit</h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { field: "unitName" as const, placeholder: "Unit name (e.g. 1A)" },
              { field: "monthlyRent" as const, placeholder: "Monthly rent" },
              { field: "advanceAmount" as const, placeholder: "Advance amount" },
            ].map(({ field, placeholder }) => (
              <div key={field}>
                <input
                  {...register(field)}
                  placeholder={placeholder}
                  type={field !== "unitName" ? "number" : "text"}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors[field] && (
                  <p className="text-red-500 text-xs mt-1">{errors[field]?.message}</p>
                )}
              </div>
            ))}
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
        ) : units.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Home size={36} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">No units yet. Add your first one above.</p>
          </div>
        ) : (
          units.map(
            (u: {
              id: string;
              unitName: string;
              monthlyRent: number;
              advanceAmount: number;
              status: string;
            }) => (
              <div
                key={u.id}
                className="flex items-center justify-between px-5 py-4 hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColor[u.status] ?? "bg-gray-100 text-gray-600"}`}
                  >
                    {u.status}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{u.unitName}</p>
                    <p className="text-xs text-gray-400">
                      Rent: ₹{u.monthlyRent.toLocaleString()} &middot; Advance: ₹
                      {u.advanceAmount.toLocaleString()}
                    </p>
                  </div>
                </div>
                {u.status === "VACANT" && (
                  <button
                    onClick={() => remove.mutate(u.id)}
                    className="text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            ),
          )
        )}
      </div>
    </div>
  );
}
