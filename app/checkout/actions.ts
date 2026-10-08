"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { ApiError } from "@/lib/api/client";
import { createCustomer, findCustomerByEmail } from "@/lib/api/customers";
import { createOrder } from "@/lib/api/orders";
import { PRODUCTS_TAG } from "@/lib/api/products";
import { getCart, getCartDetails, setCart } from "@/lib/cart";
import {
  isCheckoutField,
  readCheckoutForm,
  validateCheckout,
  type CheckoutState,
  type ValidCheckout,
} from "@/lib/checkout";

export async function placeOrder(_previous: CheckoutState, formData: FormData): Promise<CheckoutState> {
  const values = readCheckoutForm(formData);
  const { data, fieldErrors } = validateCheckout(values);
  if (!data) return { values, fieldErrors };

  const { items } = await getCartDetails(await getCart());
  if (items.length === 0) redirect("/cart");

  let orderNumber: string;
  try {
    const order = await createOrder({
      customerId: await resolveCustomerId(data),
      items: items.map((item) => ({ productId: item.product.id, quantity: item.quantity })),
      paymentMethod: data.paymentMethod,
      shippingAddress: data.address,
      notes: data.notes || undefined,
    });
    orderNumber = order.orderNumber;
  } catch (error) {
    if (error instanceof ApiError) return { values, ...toFormErrors(error) };
    throw error;
  }

  await setCart([]);
  updateTag(PRODUCTS_TAG); // stock changed
  redirect(`/orders/${encodeURIComponent(orderNumber)}`);
}

/** Creates the customer, or reuses the existing one when the email is already registered. */
async function resolveCustomerId(data: ValidCheckout): Promise<number> {
  try {
    const customer = await createCustomer({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone || undefined,
      address: data.address,
    });
    return customer.id;
  } catch (error) {
    if (error instanceof ApiError && error.status === 409) {
      const existing = await findCustomerByEmail(data.email);
      if (existing) return existing.id;
    }
    throw error;
  }
}

function toFormErrors(error: ApiError): Omit<CheckoutState, "values"> {
  const fieldErrors: CheckoutState["fieldErrors"] = {};
  const otherMessages: string[] = [];

  for (const { field, message } of error.fieldErrors) {
    if (isCheckoutField(field)) fieldErrors[field] = message;
    else otherMessages.push(`${field}: ${message}`);
  }

  const hasFieldErrors = Object.keys(fieldErrors).length > 0;
  const message = otherMessages.length > 0 ? otherMessages.join(". ") : hasFieldErrors ? undefined : error.message;
  return { fieldErrors, error: message };
}
