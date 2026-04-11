import api from "./api";

// Auth
export const authApi = {
  register: (data: { name: string; email: string; password: string; mobileNumber?: string }) =>
    api.post("/auth/register", data).then((r) => r.data),
  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data).then((r) => r.data),
};

export type PropertyPayload = {
  name: string;
  ownerName?: string;
  phone?: string;
  addressLine1?: string;
  addressLine2?: string;
  location?: string;
  pincode?: string;
};

// Properties
export const propertyApi = {
  list: (page = 1, limit = 10) =>
    api.get("/properties", { params: { page, limit } }).then((r) => r.data),
  create: (data: PropertyPayload) =>
    api.post("/properties", data).then((r) => r.data),
  update: (id: string, data: Partial<PropertyPayload>) =>
    api.patch(`/properties/${id}`, data).then((r) => r.data),
  delete: (id: string) =>
    api.delete(`/properties/${id}`).then((r) => r.data),
};

// Units
export const unitApi = {
  list: (propertyId: string, page = 1, limit = 10) =>
    api.get(`/properties/${propertyId}/units`, { params: { page, limit } }).then((r) => r.data),
  create: (propertyId: string, data: { unitName: string; monthlyRent: number; advanceAmount: number }) =>
    api.post(`/properties/${propertyId}/units`, data).then((r) => r.data),
  update: (unitId: string, data: { unitName?: string; monthlyRent?: number; advanceAmount?: number }) =>
    api.patch(`/units/${unitId}`, data).then((r) => r.data),
  delete: (unitId: string) =>
    api.delete(`/units/${unitId}`).then((r) => r.data),
};

// Tenants
export const tenantApi = {
  get: (unitId: string) =>
    api.get(`/units/${unitId}/tenant`).then((r) => r.data),
  assign: (unitId: string, data: { name: string; phone: string; email: string }) =>
    api.post(`/units/${unitId}/tenant`, data).then((r) => r.data),
  update: (unitId: string, data: { name?: string; phone?: string; email?: string }) =>
    api.patch(`/units/${unitId}/tenant`, data).then((r) => r.data),
  remove: (unitId: string) =>
    api.delete(`/units/${unitId}/tenant`).then((r) => r.data),
};

// Rent Bills
export const rentBillApi = {
  list: (unitId: string) =>
    api.get(`/units/${unitId}/rent-bills`).then((r) => r.data),
  create: (unitId: string, data: { month: string; dueDate: string; amount: number }) =>
    api.post(`/units/${unitId}/rent-bills`, data).then((r) => r.data),
};

// Payments
export const paymentApi = {
  record: (rentBillId: string, data: { amount: number; method: string; paidAt: string }) =>
    api.post(`/rent-bills/${rentBillId}/payments`, data).then((r) => r.data),
};
