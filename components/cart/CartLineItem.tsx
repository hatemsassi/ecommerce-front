import Link from "next/link";
import { removeFromCart, updateQuantity } from "@/app/cart/actions";
import { Price } from "@/components/Price";
import { SubmitButton } from "@/components/SubmitButton";
import { MAX_LINE_QUANTITY, type CartItem } from "@/lib/cart";

export function CartLineItem({ item }: { item: CartItem }) {
  const { product, quantity, subtotal } = item;

  return (
    <li className="flex flex-wrap items-center gap-4 py-5">
      <div className="min-w-48 flex-1">
        <Link href={`/products/${product.id}`} className="font-medium hover:underline">
          {product.name}
        </Link>
        <p className="text-sm text-zinc-500">
          <Price amount={product.price} /> each
        </p>
      </div>
      <form action={updateQuantity.bind(null, product.id)} className="flex items-center gap-2">
        <label className="sr-only" htmlFor={`quantity-${product.id}`}>
          Quantity for {product.name}
        </label>
        <input
          id={`quantity-${product.id}`}
          type="number"
          name="quantity"
          defaultValue={quantity}
          min={0}
          max={Math.min(product.stockQuantity, MAX_LINE_QUANTITY)}
          className="input w-20"
        />
        <SubmitButton variant="secondary" pendingLabel="…">
          Update
        </SubmitButton>
      </form>
      <Price amount={subtotal} className="w-28 text-right font-medium" />
      <form action={removeFromCart.bind(null, product.id)}>
        <SubmitButton variant="link">Remove</SubmitButton>
      </form>
    </li>
  );
}
