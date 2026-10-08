import Link from "next/link";
import { Price } from "@/components/Price";
import type { Product } from "@/lib/api/products";
import { StockBadge } from "./StockBadge";

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="flex h-full flex-col rounded-lg border border-zinc-200 p-5 transition hover:border-foreground dark:border-zinc-800"
    >
      <span className="text-xs uppercase tracking-wide text-zinc-500">{product.categoryName}</span>
      <h2 className="mt-1 font-medium">{product.name}</h2>
      {product.description && (
        <p className="mt-2 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">{product.description}</p>
      )}
      <div className="mt-auto flex items-center justify-between pt-4">
        <Price amount={product.price} className="font-semibold" />
        <StockBadge stock={product.stockQuantity} />
      </div>
    </Link>
  );
}

export function ProductGridSkeleton() {
  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-hidden>
      {Array.from({ length: 6 }, (_, i) => (
        <li key={i} className="h-40 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-900" />
      ))}
    </ul>
  );
}
