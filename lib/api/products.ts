import { cacheLife, cacheTag } from "next/cache";
import { ApiError, apiFetch, toQuery, type Page, type PageQuery } from "./client";

export type Product = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  sku: string;
  stockQuantity: number;
  active: boolean;
  categoryId: number;
  categoryName: string;
  createdAt: string;
  updatedAt: string;
};

export type ProductQuery = PageQuery & { categoryId?: number };

export const PRODUCTS_TAG = "products";

export async function listProducts(query: ProductQuery = {}): Promise<Page<Product>> {
  "use cache";
  cacheLife("minutes");
  cacheTag(PRODUCTS_TAG);

  return apiFetch(`/api/v1/products${toQuery(query)}`);
}

/** Returns null when the product does not exist. */
export async function getProduct(id: number): Promise<Product | null> {
  "use cache";
  cacheLife("minutes");
  cacheTag(PRODUCTS_TAG);

  try {
    return await apiFetch<Product>(`/api/v1/products/${id}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}
