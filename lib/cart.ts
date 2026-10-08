import { cookies } from "next/headers";
import { getProduct, type Product } from "./api/products";

export type CartLine = { productId: number; quantity: number };

export type CartItem = { product: Product; quantity: number; subtotal: number };

export type CartDetails = { items: CartItem[]; total: number };

const COOKIE_NAME = "cart";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

/** Per-line limit enforced by the API on order items. */
export const MAX_LINE_QUANTITY = 1000;

export async function getCart(): Promise<CartLine[]> {
  const raw = (await cookies()).get(COOKIE_NAME)?.value;
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isCartLine) : [];
  } catch {
    return [];
  }
}

export async function setCart(lines: CartLine[]): Promise<void> {
  const store = await cookies();
  if (lines.length === 0) {
    store.delete(COOKIE_NAME);
    return;
  }
  store.set(COOKIE_NAME, JSON.stringify(lines), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

/** Loads current price and stock for every line; drops products that no longer exist or are inactive. */
export async function getCartDetails(lines: CartLine[]): Promise<CartDetails> {
  const products = await Promise.all(lines.map((line) => getProduct(line.productId)));

  const items: CartItem[] = [];
  lines.forEach((line, i) => {
    const product = products[i];
    if (product?.active) {
      items.push({ product, quantity: line.quantity, subtotal: lineTotal(product.price, line.quantity) });
    }
  });

  return { items, total: sumAmounts(items.map((item) => item.subtotal)) };
}

export function addLine(lines: CartLine[], productId: number, quantity: number, max: number): CartLine[] {
  const existing = lines.find((line) => line.productId === productId);
  const next = clamp((existing?.quantity ?? 0) + quantity, max);
  if (next <= 0) return lines;
  return existing
    ? lines.map((line) => (line.productId === productId ? { productId, quantity: next } : line))
    : [...lines, { productId, quantity: next }];
}

export function updateLine(lines: CartLine[], productId: number, quantity: number, max: number): CartLine[] {
  const next = clamp(quantity, max);
  if (next <= 0) return removeLine(lines, productId);
  return lines.map((line) => (line.productId === productId ? { productId, quantity: next } : line));
}

export function removeLine(lines: CartLine[], productId: number): CartLine[] {
  return lines.filter((line) => line.productId !== productId);
}

export function cartCount(lines: CartLine[]): number {
  return lines.reduce((count, line) => count + line.quantity, 0);
}

function clamp(quantity: number, max: number): number {
  return Math.min(quantity, max, MAX_LINE_QUANTITY);
}

// Amounts are summed in cents to avoid floating-point drift.
function lineTotal(price: number, quantity: number): number {
  return (Math.round(price * 100) * quantity) / 100;
}

function sumAmounts(amounts: number[]): number {
  return amounts.reduce((sum, amount) => sum + Math.round(amount * 100), 0) / 100;
}

function isCartLine(value: unknown): value is CartLine {
  if (typeof value !== "object" || value === null) return false;
  const { productId, quantity } = value as Record<string, unknown>;
  return Number.isInteger(productId) && Number.isInteger(quantity) && (quantity as number) > 0;
}
