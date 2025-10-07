import React, { useEffect, useRef, useState } from 'react';
import { Star, CheckCircle, ChevronLeft, ChevronRight, X } from 'lucide-react';

const getAvgRating = (reviews) => {
  if (!reviews?.length) return 0;
  return (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);
};

const getMediaUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url; 
  return `${import.meta.env.VITE_API_URL}/uploads/${url}`; 
};

const StarIcon = ({ filled }) => (
  <Star className={`w-5 h-5 ${filled ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`} />
);

const CheckCircleIcon = () => (
  <CheckCircle className="w-4 h-4 text-green-500 inline-block ml-1" />
);

const ReviewCard = ({ review }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openModal = (index) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  return (
    <div className="bg-white p-6 hover:shadow-lg rounded-xl shadow-sm border border-[#35894E] flex flex-col justify-between">
      <div>
        {/* Stars */}
        <div className="flex mb-2">
          {[...Array(5)].map((_, i) => (
            <StarIcon key={i} filled={i < review.rating} />
          ))}
        </div>

        {/* User Name + Verified */}
        <div className="mb-1 text-[#35894E] font-semibold text-lg flex items-center">
          <span className="font-heading">{review.name || 'Anonymous'}</span>
          {(review.verified ?? false) && <CheckCircleIcon />}
        </div>

        {/* Comment */}
        <p className="font-body text-[#93A87E] text-sm leading-relaxed mb-3">
          {review.comment}
        </p>

        {/* Media (Images / Videos) */}
        {review.media?.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-3">
            {review.media.map((m, idx) =>
              m.type === 'image' ? (
                <img
                  key={m._id || `${m.url}-${idx}`}
                  src={getMediaUrl(m.url)}
                  alt="review-media"
                  onClick={() => openModal(idx)}
                  className="w-56 h-40 object-cover rounded-lg border border-gray-200 cursor-pointer"
                />
              ) : (
                <video
                  key={m._id || `${m.url}-${idx}`}
                  src={getMediaUrl(m.url)}
                  onClick={() => openModal(idx)}
                  className="w-56 h-40 rounded-lg border border-gray-200 cursor-pointer"
                />
              )
            )}
          </div>
        )}
      </div>

      {/* Date */}
      <p className="font-body text-[#35894E] text-xs mt-4">
        Posted on -{' '}
        {review.date
          ? new Date(review.date).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })
          : new Date(review.createdAt).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}
      </p>

      {/*  Fullscreen Modal with Carousel */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="relative max-w-4xl w-full p-4 flex flex-col items-center">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute -top-7 lg:-top-0 right-2 lg:right-10 text-white text-3xl font-bold z-50"
            >
              <X />
            </button>

            {/* Left Navigation */}
            <button
              onClick={() =>
                setCurrentIndex((prev) =>
                  prev === 0 ? review.media.length - 1 : prev - 1
                )
              }
              className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white text-3xl z-50"
            >
              <ChevronLeft />
            </button>

            {/* Right Navigation */}
            <button
              onClick={() =>
                setCurrentIndex((prev) =>
                  prev === review.media.length - 1 ? 0 : prev + 1
                )
              }
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white text-3xl z-50"
            >
              <ChevronRight />
            </button>

            {/* Media Display */}
            {review.media[currentIndex]?.type === 'image' ? (
              <img
                src={getMediaUrl(review.media[currentIndex].url)}
                alt={`Media ${currentIndex + 1}`}
                className="w-full h-auto max-h-[90vh] rounded-lg object-contain"
              />
            ) : (
              <video
                src={getMediaUrl(review.media[currentIndex].url)}
                controls
                autoPlay
                className="w-full h-auto max-h-[90vh] rounded-lg object-contain"
              />
            )}

            {/* Index Counter */}
            <div className="text-white mt-2">
              {currentIndex + 1} / {review.media.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ProductReviews = ({ reviews = [], error = null }) => {
  const avgRating = getAvgRating(reviews);
  const reviewsCount = reviews.length;

  const hasShownToastRef = useRef(false);

  useEffect(() => {
    if (error && !hasShownToastRef.current) {
      toast.error(`Failed to load reviews: ${error}`);
      hasShownToastRef.current = true;
    }
  }, [error]);

  return (
    <>
      <div className="font-sans antialiased text-gray-800 flex flex-col items-center">
        <div className="w-full max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <h2 className=" font-home text-2xl sm:text-3xl font-bold text-[#35894E] mb-4 sm:mb-0">
              All Reviews <span className="text-[#35894eb7]">({reviewsCount})</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {reviews.map((review) => (
              <ReviewCard key={review.id || review._id} review={review} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductReviews;