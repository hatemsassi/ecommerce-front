import { EmptyState } from "@/components/EmptyState";

export default function NotFound() {
  return (
    <EmptyState
      title="Page not found"
      message="This product or order doesn't exist."
      action={{ href: "/products", label: "Back to products" }}
    />
  );
}
