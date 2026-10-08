import { PAYMENT_METHODS, type PaymentMethod } from "./api/orders";

export type CheckoutValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  paymentMethod: string;
  notes: string;
};

export type CheckoutField = keyof CheckoutValues;

export type CheckoutState = {
  values?: CheckoutValues;
  fieldErrors?: Partial<Record<CheckoutField, string>>;
  error?: string;
};

export type ValidCheckout = Omit<CheckoutValues, "paymentMethod"> & { paymentMethod: PaymentMethod };

const FIELDS: CheckoutField[] = ["firstName", "lastName", "email", "phone", "address", "paymentMethod", "notes"];

// Same limits as the API's CustomerRequest / OrderRequest schemas.
const MAX_LENGTH: Partial<Record<CheckoutField, number>> = {
  firstName: 100,
  lastName: 100,
  email: 255,
  phone: 20,
};

const REQUIRED: CheckoutField[] = ["firstName", "lastName", "email", "address", "paymentMethod"];

export function readCheckoutForm(formData: FormData): CheckoutValues {
  const values = {} as CheckoutValues;
  for (const field of FIELDS) {
    const value = formData.get(field);
    values[field] = typeof value === "string" ? value.trim() : "";
  }
  return values;
}

export function validateCheckout(values: CheckoutValues): {
  data?: ValidCheckout;
  fieldErrors: Partial<Record<CheckoutField, string>>;
} {
  const fieldErrors: Partial<Record<CheckoutField, string>> = {};

  for (const field of REQUIRED) {
    if (!values[field]) fieldErrors[field] = "Required";
  }
  for (const [field, max] of Object.entries(MAX_LENGTH) as [CheckoutField, number][]) {
    if (values[field].length > max) fieldErrors[field] = `At most ${max} characters`;
  }
  if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    fieldErrors.email = "Enter a valid email address";
  }
  if (values.paymentMethod && !isPaymentMethod(values.paymentMethod)) {
    fieldErrors.paymentMethod = "Choose a payment method";
  }

  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };
  return { data: values as ValidCheckout, fieldErrors };
}

export function isCheckoutField(field: string): field is CheckoutField {
  return (FIELDS as string[]).includes(field);
}

function isPaymentMethod(value: string): value is PaymentMethod {
  return (PAYMENT_METHODS as readonly string[]).includes(value);
}
