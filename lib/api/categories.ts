import { cacheLife } from "next/cache";
import { apiFetch } from "./client";

export type Category = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

export async function listCategories(): Promise<Category[]> {
  "use cache";
  cacheLife("hours");

  return apiFetch("/api/v1/categories");
}
