import { cacheLife } from "next/cache";
import { apiFetch, toQuery, type Page, type PageQuery } from "./client";

export type Review = {
  id: number;
  productId: number;
  customerId: number;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export async function listReviews(productId: number, query: PageQuery = {}): Promise<Page<Review>> {
  "use cache";
  cacheLife("minutes");

  return apiFetch(`/api/v1/products/${productId}/reviews${toQuery(query)}`);
}
