'use client';

import { motion } from 'framer-motion';
import { GlassCard } from './GlassCard';
import { Star, MessageSquare, Trash2, Filter, Search, Reply, Flag } from 'lucide-react';
import { useState } from 'react';

interface Review {
  id: number;
  customer: string;
  rating: number;
  comment: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  response?: string;
}

interface ReviewManagementProps {
  reviews: Review[];
  onUpdateStatus: (id: number, status: Review['status']) => void;
  onRespond: (id: number, response: string) => void;
  onDelete: (id: number) => void;
}

export function ReviewManagement({ reviews, onUpdateStatus, onRespond, onDelete }: ReviewManagementProps) {
  const [selectedStatus, setSelectedStatus] = useState<'all' | Review['status']>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [respondingTo, setRespondingTo] = useState<number | null>(null);
  const [responseText, setResponseText] = useState('');

  const filteredReviews = reviews.filter(review => {
    const matchesStatus = selectedStatus === 'all' || review.status === selectedStatus;
    const matchesSearch = review.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         review.comment.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const statusCounts = {
    all: reviews.length,
    pending: reviews.filter(r => r.status === 'pending').length,
    approved: reviews.filter(r => r.status === 'approved').length,
    rejected: reviews.filter(r => r.status === 'rejected').length,
  };

  const getStatusColor = (status: Review['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'approved':
        return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'rejected':
        return 'bg-red-500/20 text-red-500 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-500 border-gray-500/30';
    }
  };

  const handleSubmitResponse = () => {
    if (respondingTo && responseText.trim()) {
      onRespond(respondingTo, responseText);
      setRespondingTo(null);
      setResponseText('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-black dark:text-white mb-1">
            Review Management
          </h2>
          <p className="text-black/60 dark:text-white/60">
            Manage customer reviews and respond to feedback
          </p>
        </div>
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-3">
        {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-4 py-2 rounded-full border-2 transition-all flex items-center space-x-2 ${
              selectedStatus === status
                ? 'bg-[#D4AF37] text-white border-[#D4AF37]'
                : 'bg-transparent text-black dark:text-white border-[#D4AF37]/30 hover:border-[#D4AF37]'
            }`}
          >
            <Star className="w-4 h-4" />
            <span className="capitalize">{status}</span>
            <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">
              {statusCounts[status]}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <GlassCard className="p-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#D4AF37] w-5 h-5" />
          <input
            type="text"
            placeholder="Search reviews by customer or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/60 dark:bg-black/60 backdrop-blur-xl border-2 border-[#D4AF37]/30 rounded-full text-black dark:text-white placeholder-black/40 dark:placeholder-white/40 focus:outline-none focus:border-[#D4AF37] transition-all"
          />
        </div>
      </GlassCard>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassCard className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-full flex items-center justify-center">
                    <span className="text-xl font-bold text-[#D4AF37]">
                      {review.customer.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-black dark:text-white">
                      {review.customer}
                    </h3>
                    <p className="text-sm text-black/60 dark:text-white/60">
                      {review.date}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(review.status)}`}>
                    <span className="capitalize">{review.status}</span>
                  </span>
                  
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? 'text-[#D4AF37] fill-[#D4AF37]'
                            : 'text-black/20 dark:text-white/20'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-black/70 dark:text-white/70 mb-4">
                {review.comment}
              </p>

              {review.response && (
                <div className="mb-4 p-4 bg-[#D4AF37]/10 rounded-lg border-l-4 border-[#D4AF37]">
                  <p className="text-sm text-black/70 dark:text-white/70">
                    <span className="font-bold">Your response:</span> {review.response}
                  </p>
                </div>
              )}

              {respondingTo === review.id && (
                <div className="mb-4 space-y-3">
                  <textarea
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 bg-white/60 dark:bg-black/60 backdrop-blur-xl border-2 border-[#D4AF37]/30 rounded-xl text-black dark:text-white focus:outline-none focus:border-[#D4AF37] transition-all resize-none"
                    placeholder="Write your response..."
                  />
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSubmitResponse}
                      className="px-4 py-2 bg-[#D4AF37] text-white rounded-full font-medium hover:bg-[#B8962F] transition-colors"
                    >
                      Send Response
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setRespondingTo(null);
                        setResponseText('');
                      }}
                      className="px-4 py-2 border-2 border-[#D4AF37]/30 text-black dark:text-white rounded-full font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-[#D4AF37]/20">
                <div className="flex space-x-2">
                  {review.status === 'pending' && (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onUpdateStatus(review.id, 'approved')}
                        className="px-4 py-2 bg-green-500/20 text-green-500 border-2 border-green-500/30 rounded-full font-medium hover:bg-green-500/30 transition-all"
                      >
                        Approve
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onUpdateStatus(review.id, 'rejected')}
                        className="px-4 py-2 bg-red-500/20 text-red-500 border-2 border-red-500/30 rounded-full font-medium hover:bg-red-500/30 transition-all"
                      >
                        Reject
                      </motion.button>
                    </>
                  )}
                  
                  {!review.response && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setRespondingTo(review.id)}
                      className="px-4 py-2 bg-[#D4AF37]/20 text-[#D4AF37] border-2 border-[#D4AF37]/30 rounded-full font-medium hover:bg-[#D4AF37]/30 transition-all flex items-center space-x-2"
                    >
                      <Reply className="w-4 h-4" />
                      <span>Respond</span>
                    </motion.button>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onDelete(review.id)}
                  className="p-2 text-red-500 hover:bg-red-500/10 rounded-full"
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <GlassCard className="p-12 text-center">
          <MessageSquare className="w-16 h-16 text-[#D4AF37]/30 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-black dark:text-white mb-2">
            No reviews found
          </h3>
          <p className="text-black/60 dark:text-white/60">
            {selectedStatus === 'all' 
              ? 'There are no reviews yet' 
              : `No reviews with status "${selectedStatus}"`}
          </p>
        </GlassCard>
      )}
    </div>
  );
}