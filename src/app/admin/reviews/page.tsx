'use client';

import { ReviewManagement } from '@/components/ReviewManagement';
import { useEffect, useState } from 'react';
import { getReviews, updateReviewStatus, respondToReview, deleteReview } from '@/lib/actions';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    // Auth guaranteed by middleware — fetch immediately
    getReviews().then(setReviews).catch(console.error);
  }, []);

  const handleUpdateStatus = async (id: number, status: string) => {
    await updateReviewStatus(id, status);
    setReviews(await getReviews());
  };
  const handleRespond = async (id: number, response: string) => {
    await respondToReview(id, response);
    setReviews(await getReviews());
  };
  const handleDelete = async (id: number) => {
    await deleteReview(id);
    setReviews(await getReviews());
  };

  const mappedReviews = reviews.map((r: any) => ({
    id: r.id, customer: r.customer, rating: r.rating, comment: r.comment,
    date: new Date(r.date).toLocaleDateString(), status: r.status, response: r.response,
  }));

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <ReviewManagement reviews={mappedReviews} onUpdateStatus={handleUpdateStatus as any} onRespond={handleRespond} onDelete={handleDelete} />
    </div>
  );
}
