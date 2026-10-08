"use client";

import { useActionState } from "react";
import { placeOrder } from "@/app/checkout/actions";
import { SubmitButton } from "@/components/SubmitButton";
import { PAYMENT_METHODS } from "@/lib/api/orders";
import type { CheckoutField, CheckoutState } from "@/lib/checkout";
import { formatPaymentMethod } from "@/lib/format";

export function CheckoutForm() {
  const [state, formAction] = useActionState(placeOrder, {} as CheckoutState);
  const values = state.values;
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} noValidate className="space-y-8">
      {state.error && (
        <p role="alert" className="rounded-md border border-red-300 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
          {state.error}
        </p>
      )}

      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="mb-4 font-semibold">Contact</legend>
        <Field name="firstName" label="First name" autoComplete="given-name" values={values} errors={errors} />
        <Field name="lastName" label="Last name" autoComplete="family-name" values={values} errors={errors} />
        <Field name="email" label="Email" type="email" autoComplete="email" values={values} errors={errors} />
        <Field name="phone" label="Phone (optional)" type="tel" autoComplete="tel" values={values} errors={errors} />
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="mb-4 font-semibold">Shipping</legend>
        <Field name="address" label="Shipping address" multiline autoComplete="street-address" values={values} errors={errors} />
        <Field name="notes" label="Order notes (optional)" multiline values={values} errors={errors} />
      </fieldset>

      <fieldset>
        <legend className="mb-4 font-semibold">Payment</legend>
        <label className="flex flex-col gap-1 text-sm">
          Payment method
          {/* Keyed so it remounts: React doesn't re-apply a changed defaultValue to <select> before the post-action form reset. */}
          <select
            key={values?.paymentMethod ?? ""}
            name="paymentMethod"
            defaultValue={values?.paymentMethod ?? ""}
            aria-invalid={!!errors.paymentMethod}
            className="input"
          >
            <option value="" disabled>
              Choose…
            </option>
            {PAYMENT_METHODS.map((method) => (
              <option key={method} value={method}>
                {formatPaymentMethod(method)}
              </option>
            ))}
          </select>
          {errors.paymentMethod && <span className="text-red-600 dark:text-red-400">{errors.paymentMethod}</span>}
        </label>
      </fieldset>

      <SubmitButton pendingLabel="Placing order…">Place order</SubmitButton>
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  multiline,
  autoComplete,
  values,
  errors,
}: {
  name: CheckoutField;
  label: string;
  type?: string;
  multiline?: boolean;
  autoComplete?: string;
  values?: CheckoutState["values"];
  errors: NonNullable<CheckoutState["fieldErrors"]>;
}) {
  const error = errors[name];
  const shared = {
    name,
    autoComplete,
    defaultValue: values?.[name] ?? "",
    "aria-invalid": !!error,
    className: "input",
  };

  return (
    <label className="flex flex-col gap-1 text-sm">
      {label}
      {multiline ? <textarea rows={3} {...shared} /> : <input type={type} {...shared} />}
      {error && <span className="text-red-600 dark:text-red-400">{error}</span>}
    </label>
  );
}
