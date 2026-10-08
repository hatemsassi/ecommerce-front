"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({
  children,
  pendingLabel,
  variant = "primary",
}: {
  children: React.ReactNode;
  pendingLabel?: string;
  variant?: "primary" | "secondary" | "link";
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={`button-${variant}`}>
      {pending && pendingLabel ? pendingLabel : children}
    </button>
  );
}
