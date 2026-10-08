import type { Metadata } from "next";
import { Suspense } from "react";
import { EmptyState } from "@/components/EmptyState";
import { Pagination } from "@/components/Pagination";
import { CategoryFilter } from "@/components/products/CategoryFilter";
import { ProductGrid, ProductGridSkeleton } from "@/components/products/ProductGrid";
import { listCategories } from "@/lib/api/categories";
import { listProducts } from "@/lib/api/products";
import { parsePositiveInt } from "@/lib/params";

const PAGE_SIZE = 12;

export const metadata: Metadata = { title: "Products" };

export default function ProductsPage({ searchParams }: PageProps<"/products">) {
  return (
    <>
      <h1 className="mb-6 text-3xl font-semibold tracking-tight">Products</h1>
      <Suspense fallback={<ProductGridSkeleton />}>
        <Catalog searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function Catalog({ searchParams }: Pick<PageProps<"/products">, "searchParams">) {
  const params = await searchParams;
  const categoryId = parsePositiveInt(params.category);
  const page = parsePositiveInt(params.page) ?? 1;

  const [categories, result] = await Promise.all([
    listCategories(),
    listProducts({ categoryId, page: page - 1, size: PAGE_SIZE, sort: "name,asc" }),
  ]);
  const products = result.content.filter((product) => product.active);

  const hrefFor = (target: number) => {
    const query = new URLSearchParams();
    if (categoryId) query.set("category", String(categoryId));
    if (target > 1) query.set("page", String(target));
    const search = query.toString();
    return search ? `/products?${search}` : "/products";
  };

  return (
    <>
      <div className="mb-8">
        <CategoryFilter categories={categories} activeId={categoryId} />
      </div>
      {products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <EmptyState
          title="No products found"
          message="Try another category."
          action={{ href: "/products", label: "Show all products" }}
        />
      )}
      <Pagination page={page} totalPages={result.page.totalPages} hrefFor={hrefFor} />
    </>
  );
}
