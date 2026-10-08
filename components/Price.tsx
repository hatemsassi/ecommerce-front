import { formatMoney } from "@/lib/format";

export function Price({ amount, className }: { amount: number; className?: string }) {
  return <span className={`tabular-nums ${className ?? ""}`}>{formatMoney(amount)}</span>;
}
