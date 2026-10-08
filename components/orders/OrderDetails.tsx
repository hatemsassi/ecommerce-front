import { Price } from "@/components/Price";
import type { Order } from "@/lib/api/orders";
import { formatDate, formatEnum, formatPaymentMethod } from "@/lib/format";

export function OrderDetails({ order }: { order: Order }) {
  return (
    <div className="space-y-10">
      <header>
        <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Thank you for your order!</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Order {order.orderNumber}</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Placed {formatDate(order.createdAt)} · Status: {formatEnum(order.status)}
        </p>
      </header>

      <OrderItemsTable order={order} />

      <div className="grid gap-6 sm:grid-cols-2">
        <InfoBlock title="Shipping address">
          <p className="whitespace-pre-line">{order.shippingAddress || "—"}</p>
          {order.notes && <p className="mt-2 text-sm text-zinc-500">Notes: {order.notes}</p>}
        </InfoBlock>
        <InfoBlock title="Payment">
          {order.payment ? (
            <p>
              {formatPaymentMethod(order.payment.paymentMethod)} ·{formatEnum(order.payment.paymentStatus)}
            </p>
          ) : (
            <p>—</p>
          )}
        </InfoBlock>
      </div>
    </div>
  );
}

function OrderItemsTable({ order }: { order: Order }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800">
          <tr>
            <th className="py-2 font-medium">Product</th>
            <th className="py-2 font-medium">SKU</th>
            <th className="py-2 text-right font-medium">Qty</th>
            <th className="py-2 text-right font-medium">Unit price</th>
            <th className="py-2 text-right font-medium">Subtotal</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {order.items.map((item) => (
            <tr key={item.id}>
              <td className="py-3">{item.productName}</td>
              <td className="py-3 text-zinc-500">{item.sku}</td>
              <td className="py-3 text-right tabular-nums">{item.quantity}</td>
              <td className="py-3 text-right">
                <Price amount={item.unitPrice} />
              </td>
              <td className="py-3 text-right">
                <Price amount={item.subtotal} />
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t border-zinc-200 text-base font-semibold dark:border-zinc-800">
            <td colSpan={4} className="py-3 text-right">
              Total
            </td>
            <td className="py-3 text-right">
              <Price amount={order.totalAmount} />
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

function InfoBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-zinc-200 p-5 dark:border-zinc-800">
      <h2 className="mb-2 font-semibold">{title}</h2>
      {children}
    </section>
  );
}
