import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { OrderDetails } from "@/components/orders/OrderDetails";
import { getOrderByNumber } from "@/lib/api/orders";

export default function OrderPage({ params }: PageProps<"/orders/[orderNumber]">) {
  return (
    <>
      <Suspense fallback={<div className="h-96 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-900" />}>
        <Order params={params} />
      </Suspense>
      <Link href="/products" className="button-secondary mt-10 inline-block">
        Continue shopping
      </Link>
    </>
  );
}

async function Order({ params }: Pick<PageProps<"/orders/[orderNumber]">, "params">) {
  const { orderNumber } = await params;
  const order = await getOrderByNumber(orderNumber);
  if (!order) notFound();

  return <OrderDetails order={order} />;
}
