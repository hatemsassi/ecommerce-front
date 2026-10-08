import Link from "next/link";
import { Suspense } from "react";
import { cartCount, getCart } from "@/lib/cart";

export function Header() {
  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4">
        <Link href="/products" className="text-lg font-semibold tracking-tight">
          Storefront
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/products" className="hover:underline">
            Products
          </Link>
          <Link href="/cart" className="flex items-center gap-2 hover:underline">
            Cart
            <Suspense fallback={null}>
              <CartBadge />
            </Suspense>
          </Link>
        </nav>
      </div>
    </header>
  );
}

async function CartBadge() {
  const count = cartCount(await getCart());
  if (count === 0) return null;
  return (
    <span className="rounded-full bg-foreground px-2 py-0.5 text-xs font-medium tabular-nums text-background">
      {count}
    </span>
  );
}
