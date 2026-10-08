import { apiFetch, type Page } from "./client";

export type Customer = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  address: string | null;
  createdAt: string;
};

export type CustomerInput = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
};

export function createCustomer(input: CustomerInput): Promise<Customer> {
  return apiFetch("/api/v1/customers", { method: "POST", body: JSON.stringify(input) });
}

/**
 * The API has no lookup by email, so this pages through all customers.
 * Replace with a server-side filter once the API offers one.
 */
export async function findCustomerByEmail(email: string): Promise<Customer | null> {
  const target = email.toLowerCase();
  for (let page = 0; ; page++) {
    const result = await apiFetch<Page<Customer>>(`/api/v1/customers?page=${page}&size=100`);
    const match = result.content.find((c) => c.email.toLowerCase() === target);
    if (match) return match;
    if (page + 1 >= result.page.totalPages) return null;
  }
}
