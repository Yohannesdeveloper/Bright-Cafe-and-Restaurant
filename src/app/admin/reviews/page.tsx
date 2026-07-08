'use client';

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
    id: r.id, customer: r.customer, rating: r.rating, comment: r.comment,
    date: new Date(r.date).toLocaleDateString(), status: r.status, response: r.response,
  }));

  if (authorized === null) {
    return (
      <div className="min-h-screen bg-[#050508] flex items-center justify-center">
        <div className="relative">
          <div className="w-14 h-14 border-2 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin" />
          <div className="w-14 h-14 border-2 border-[#D4AF37]/10 rounded-full absolute inset-0 animate-ping opacity-30" />
        </div>
      </div>
    );
  }
  if (!authorized) return null;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <ReviewManagement reviews={mappedReviews} onUpdateStatus={handleUpdateStatus as any} onRespond={handleRespond} onDelete={handleDelete} />
    </div>
  );
}
