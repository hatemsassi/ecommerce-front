"use server";

import { redirect } from "next/navigation";
import { getProduct } from "@/lib/api/products";
import { addLine, getCart, removeLine, setCart, updateLine } from "@/lib/cart";

export async function addToCart(productId: number, formData: FormData): Promise<void> {
  const product = await getProduct(productId);
  if (!product?.active) return;

  const lines = await getCart();
  await setCart(addLine(lines, productId, parseQuantity(formData), product.stockQuantity));
  redirect("/cart");
}

export async function updateQuantity(productId: number, formData: FormData): Promise<void> {
  const product = await getProduct(productId);
  const lines = await getCart();

  if (!product?.active) {
    await setCart(removeLine(lines, productId));
    return;
  }
  await setCart(updateLine(lines, productId, parseQuantity(formData), product.stockQuantity));
}

export async function removeFromCart(productId: number): Promise<void> {
  await setCart(removeLine(await getCart(), productId));
}

function parseQuantity(formData: FormData): number {
  const quantity = Number(formData.get("quantity"));
  return Number.isInteger(quantity) ? quantity : 0;
}
