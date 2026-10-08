import type { PaymentMethod } from "./api/orders";

const money =new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });
const date = new Intl.DateTimeFormat("fr-FR", { dateStyle: "long", timeStyle: "short" });

export function formatMoney(amount: number): string {
  return money.format(amount);
}

export function formatDate(iso: string): string {
  return date.format(new Date(iso));
}

const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  CREDIT_CARD: "Credit card",
  DEBIT_CARD: "Debit card",
  UPI: "UPI",
  NET_BANKING: "Net banking",
  WALLET: "Wallet",
  CASH_ON_DELIVERY: "Cash on delivery",
};

export function formatPaymentMethod(method: PaymentMethod): string {
  return PAYMENT_METHOD_LABELS[method];
}

/** "CASH_ON_DELIVERY" -> "Cash on delivery" */
export function formatEnum(value: string): string {
  const words = value.toLowerCase().replaceAll("_", " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}
