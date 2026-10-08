import { Price } from "@/components/Price";
import type { CartDetails } from "@/lib/cart";

export function OrderSummary({ cart }: { cart: CartDetails }) {
  return (
    <aside className="rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
      <h2 className="font-semibold">Your order</h2>
      <ul className="mt-4 space-y-3 text-sm">
        {cart.items.map(({ product, quantity, subtotal }) => (
          <li key={product.id} className="flex justify-between gap-4">
            <span>
              {product.name} <span className="text-zinc-500">× {quantity}</span>
            </span>
            <Price amount={subtotal} />
          </li>
        ))}
      </ul>
      <div className="mt-4 flex justify-between border-t border-zinc-200 pt-4 text-lg font-semibold dark:border-zinc-800">
        <span>Total</span>
        <Price amount={cart.total} />
      </div>
    </aside>
  );
}
