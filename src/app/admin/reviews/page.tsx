'use client';

import { Navigation } from '@/components/Navigation';
import { ReviewManagement } from '@/components/ReviewManagement';
import { useEffect, useState } from 'react';
import { checkAdminAuth } from '@/lib/admin-auth';
import { getReviews, updateReviewStatus, respondToReview, deleteReview } from '@/lib/actions';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    checkAdminAuth().then((authed) => {
      if (!authed) { window.location.href = '/admin/login'; return; }
      setAuthorized(true);
      getReviews().then(setReviews).catch(console.error);
    });
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
    id: r.id,
    customer: r.customer,
    rating: r.rating,
    comment: r.comment,
    date: new Date(r.date).toLocaleDateString(),
    status: r.status,
    response: r.response,
  }));

  if (authorized === null) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!authorized) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Navigation role="admin" />
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <ReviewManagement reviews={mappedReviews} onUpdateStatus={handleUpdateStatus as any} onRespond={handleRespond} onDelete={handleDelete} />
      </div>
    </div>
  );
}
