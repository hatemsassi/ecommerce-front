import { ApiError, apiFetch } from "./client";

export const ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const PAYMENT_METHODS = [
  "CREDIT_CARD",
  "DEBIT_CARD",
  "UPI",
  "NET_BANKING",
  "WALLET",
  "CASH_ON_DELIVERY",
] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";

export type OrderItem = {
  id: number;
  productId: number;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
};

export type Payment = {
  id: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  amount: number;
  createdAt: string;
};

export type Order = {
  id: number;
  orderNumber: string;
  customerId: number;
  customerName: string;
  status: OrderStatus;
  totalAmount: number;
  shippingAddress: string | null;
  notes: string | null;
  items: OrderItem[];
  payment: Payment | null;
  createdAt: string;
  updatedAt: string;
};

export type OrderInput = {
  customerId: number;
  items: { productId: number; quantity: number }[];
  paymentMethod: PaymentMethod;
  shippingAddress?: string;
  notes?: string;
};

export function createOrder(input: OrderInput): Promise<Order> {
  return apiFetch("/api/v1/orders", { method: "POST", body: JSON.stringify(input) });
}

/** Returns null when no order has this number. */
export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  try {
    return await apiFetch<Order>(`/api/v1/orders/number/${encodeURIComponent(orderNumber)}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}
