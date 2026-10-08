import { addToCart } from "@/app/cart/actions";
import { Price } from "@/components/Price";
import { SubmitButton } from "@/components/SubmitButton";
import type { Product } from "@/lib/api/products";
import { MAX_LINE_QUANTITY } from "@/lib/cart";
import { StockBadge } from "./StockBadge";

export function ProductDetails({ product }: { product: Product }) {
  return (
    <section>
      <p className="text-sm uppercase tracking-wide text-zinc-500">{product.categoryName}</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight">{product.name}</h1>
      <p className="mt-1 text-sm text-zinc-500">SKU {product.sku}</p>
      <div className="mt-6 flex items-center gap-4">
        <Price amount={product.price} className="text-2xl font-semibold" />
        <StockBadge stock={product.stockQuantity} />
      </div>
      {product.description && <p className="mt-6 max-w-prose text-zinc-700 dark:text-zinc-300">{product.description}</p>}
      <AddToCartForm product={product} />
    </section>
  );
}

function AddToCartForm({ product }: { product: Product }) {
  if (product.stockQuantity <= 0) return null;

  return (
    <form action={addToCart.bind(null, product.id)} className="mt-8 flex items-end gap-3">
      <label className="flex flex-col gap-1 text-sm">
        Quantity
        <input
          type="number"
          name="quantity"
          defaultValue={1}
          min={1}
          max={Math.min(product.stockQuantity, MAX_LINE_QUANTITY)}
          required
          className="input w-24"
        />
      </label>
      <SubmitButton pendingLabel="Adding…">Add to cart</SubmitButton>
    </form>
  );
}
