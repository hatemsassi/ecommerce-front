const LOW_STOCK = 10;

export function StockBadge({ stock }: { stock: number }) {
  if (stock <= 0) {
    return <span className="text-sm font-medium text-red-600 dark:text-red-400">Out of stock</span>;
  }
  if (stock <= LOW_STOCK) {
    return <span className="text-sm font-medium text-amber-600 dark:text-amber-400">Only {stock} left</span>;
  }
  return <span className="text-sm text-emerald-700 dark:text-emerald-400">In stock</span>;
}
