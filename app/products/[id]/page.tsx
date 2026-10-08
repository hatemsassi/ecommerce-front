import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProductDetails } from "@/components/products/ProductDetails";
import { ReviewList } from "@/components/products/ReviewList";
import { getProduct } from "@/lib/api/products";
import { parsePositiveInt } from "@/lib/params";

export async function generateMetadata({ params }: PageProps<"/products/[id]">): Promise<Metadata> {
  const id = parsePositiveInt((await params).id);
  const product = id ? await getProduct(id) : null;
  return { title: product?.active ? product.name : "Product not found" };
}

export default function ProductPage({ params }: PageProps<"/products/[id]">) {
  return (
    <>
      <Link href="/products" className="text-sm text-zinc-600 hover:underline dark:text-zinc-400">
        ← All products
      </Link>
      <Suspense fallback={<div className="mt-6 h-64 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-900" />}>
        <Product params={params} />
      </Suspense>
    </>
  );
}

async function Product({ params }: Pick<PageProps<"/products/[id]">, "params">) {
  const id = parsePositiveInt((await params).id);
  const product = id ? await getProduct(id) : null;
  if (!product?.active) notFound();

  return (
    <div className="mt-6 space-y-12">
      <ProductDetails product={product} />
      <section>
        <h2 className="mb-4 text-xl font-semibold">Reviews</h2>
        <Suspense fallback={<p className="text-zinc-500">Loading reviews…</p>}>
          <ReviewList productId={product.id} />
        </Suspense>
      </section>
    </div>
  );
}
