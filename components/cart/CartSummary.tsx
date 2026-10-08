import Link from "next/link";
import { Price } from "@/components/Price";

export function CartSummary({ total, itemCount }: { total: number; itemCount: number }) {
  return (
    <aside className="rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
      <h2 className="font-semibold">Summary</h2>
      <dl className="mt-4 flex justify-between text-lg">
        <dt>
          Subtotal <span className="text-sm text-zinc-500">({itemCount} items)</span>
        </dt>
        <dd>
          <Price amount={total} className="font-semibold" />
        </dd>
      </dl>
      <Link href="/checkout" className="button-primary mt-6 block text-center">
        Checkout
      </Link>
    </aside>
  );
}
