import { listReviews } from "@/lib/api/reviews";
import { formatDate } from "@/lib/format";

export async function ReviewList({ productId }: { productId: number }) {
  const { content: reviews, page } = await listReviews(productId, { page: 0, size: 5, sort: "createdAt,desc" });

  if (reviews.length === 0) {
    return <p className="text-zinc-600 dark:text-zinc-400">No reviews yet.</p>;
  }

  return (
    <>
      <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
        {reviews.map((review) => (
          <li key={review.id} className="py-4">
            <div className="flex items-center gap-3">
              <RatingStars rating={review.rating} />
              <span className="font-medium">{review.customerName}</span>
              <span className="text-sm text-zinc-500">{formatDate(review.createdAt)}</span>
            </div>
            <p className="mt-2 text-zinc-700 dark:text-zinc-300">{review.comment}</p>
          </li>
        ))}
      </ul>
      {page.totalElements > reviews.length && (
        <p className="mt-2 text-sm text-zinc-500">
          Showing the {reviews.length} most recent of {page.totalElements} reviews.
        </p>
      )}
    </>
  );
}

function RatingStars({ rating }: { rating: number }) {
  const stars = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <span aria-label={`${stars} out of 5 stars`} className="text-amber-500">
      {"★".repeat(stars)}
      <span className="text-zinc-300 dark:text-zinc-700">{"★".repeat(5 - stars)}</span>
    </span>
  );
}
