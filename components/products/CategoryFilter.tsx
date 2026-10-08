import Link from "next/link";
import type { Category } from "@/lib/api/categories";

export function CategoryFilter({ categories, activeId }: { categories: Category[]; activeId?: number }) {
  return (
    <nav aria-label="Categories" className="flex flex-wrap gap-2">
      <FilterLink href="/products" active={activeId === undefined}>
        All
      </FilterLink>
      {categories.map((category) => (
        <FilterLink key={category.id} href={`/products?category=${category.id}`} active={category.id === activeId}>
          {category.name}
        </FilterLink>
      ))}
    </nav>
  );
}

function FilterLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`rounded-full border px-4 py-1.5 text-sm ${
        active
          ? "border-foreground bg-foreground text-background"
          : "border-zinc-300 hover:border-foreground dark:border-zinc-700"
      }`}
    >
      {children}
    </Link>
  );
}
