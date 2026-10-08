import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { getCart, getCartDetails } from "@/lib/cart";

export const metadata: Metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <>
      <h1 className="mb-8 text-3xl font-semibold tracking-tight">Checkout</h1>
      <Suspense fallback={<div className="h-96 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-900" />}>
        <Checkout />
      </Suspense>
    </>
  );
}

async function Checkout() {
  const cart = await getCartDetails(await getCart());
  if (cart.items.length === 0) redirect("/cart");

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_22rem]">
      <CheckoutForm />
      <div>
        <OrderSummary cart={cart} />
      </div>
    </div>
  );
}
