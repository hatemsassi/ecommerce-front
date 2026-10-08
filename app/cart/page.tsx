import type { Metadata } from "next";
import { Suspense } from "react";
import { CartLineItem } from "@/components/cart/CartLineItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { EmptyState } from "@/components/EmptyState";
import { getCart, getCartDetails } from "@/lib/cart";

export const metadata: Metadata = { title: "Cart" };

export default function CartPage() {
  return (
    <>
      <h1 className="mb-6 text-3xl font-semibold tracking-tight">Your cart</h1>
      <Suspense fallback={<div className="h-48 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-900" />}>
        <CartContents />
      </Suspense>
    </>
  );
}

async function CartContents() {
  const cart = await getCartDetails(await getCart());

  if (cart.items.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        message="Browse the catalog and add something you like."
        action={{ href: "/products", label: "Continue shopping" }}
      />
    );
  }

  const itemCount = cart.items.reduce((count, item) => count + item.quantity, 0);
  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_20rem]">
      <ul className="divide-y divide-zinc-200 border-y border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
        {cart.items.map((item) => (
          <CartLineItem key={item.product.id} item={item} />
        ))}
      </ul>
      <div>
        <CartSummary total={cart.total} itemCount={itemCount} />
      </div>
    </div>
  );
}
