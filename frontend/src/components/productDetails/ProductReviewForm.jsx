
import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { createReview, resetReview } from '@/store/reviewSlice';
import { Star } from 'lucide-react';

const MAX_FILES = 5;

const ProductReviewForm = ({ productId }) => {
  const dispatch = useDispatch();
  const { success, error } = useSelector((state) => state.review);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [media, setMedia] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (success) {
      toast.success('Review submitted successfully!');
      setRating(0);
      setComment('');
      setMedia([]);
      setShowForm(false);
      dispatch(resetReview());
    }

    if (error) {
      // agar error object hai
      if (typeof error === 'object' && error !== null) {
        toast.error(error.message || 'Something went wrong');
      } else {
        toast.error(error);
      }
      dispatch(resetReview());
    }
  }, [success, error, dispatch]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (media.length >= MAX_FILES) {
      toast.error(`Maximum ${MAX_FILES} files allowed.`);
      return;
    }

    setMedia((prev) => [...prev, file]);
    e.target.value = '';
  };

  const removeFile = (index) => {
    setMedia((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('rating', rating);
    formData.append('comment', comment);
    media.forEach((file) => formData.append('media', file));

    dispatch(createReview({ productId, formData }))
      .finally(() => setIsSubmitting(false));
  };

  return (
    <div className="flex flex-col items-start justify-start font-sans mt-4 mb-3 w-full">
      {/* Toggle Button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="bg-[#93A87E] text-white font-bold py-2 px-6 rounded  hover:bg-[#849870] transition-all"
        >
          + Add Review
        </button>
      )}

      {/* Review Form */}
      {showForm && (
        <div className="w-full p-6 bg-white rounded-xl border mt-4">
          <h3 className="font-heading text-2xl font-bold text-[#93A87E] mb-2 ">
            Your Feedback Matters!
          </h3>
          <p className="font-body text-gray-500 mb-6 ">
            Share your thoughts and help others make a decision.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Rating */}
            <div>
              <label className="font-body block text-sm font-medium text-gray-700 mb-1">
                Select Rating:
              </label>
              <div className="flex justify-start space-x-1">
                {[...Array(5)].map((_, index) => {
                  const starValue = index + 1;
                  const isFilled = (hoverRating || rating) >= starValue;
                  return (
                    <button
                      key={index}
                      type="button"
                      className={`transition-transform transform hover:scale-125 ${isFilled ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      onClick={() => setRating(starValue)}
                      onMouseEnter={() => setHoverRating(starValue)}
                      onMouseLeave={() => setHoverRating(0)}
                    >
                      <Star size={24} fill={isFilled ? 'currentColor' : 'none'} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Comment */}
            <div>
              <label htmlFor="comment" className="font-body block text-sm font-medium text-gray-700 mb-1">
                Your Comment:
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="border border-gray-300 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-green-500 transition-all resize-none"
                rows="4"
                placeholder="Tell us about your experience..."
                required
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="font-body block text-sm font-medium text-gray-700 mb-1">
                Upload Images / Videos (Max {MAX_FILES}):
              </label>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full 
                file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {media.map((file, idx) => (
                  <div key={idx} className="relative border rounded p-1">
                    <p className="text-xs max-w-[100px] truncate">{file.name}</p>
                    <button
                      type="button"
                      onClick={() => removeFile(idx)}
                      className="absolute -top-1 -right-1 text-red-500 font-bold"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-between gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="w-1/2 bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-xl hover:bg-gray-300 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-1/2 bg-[#93A87E] text-white font-bold py-3 px-4 rounded-xl 
                  hover:bg-[#879b74] focus:outline-none focus:ring-4 focus:ring-green-500 
                  transition-all shadow-md ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </form>
        </div>
      )}
      <Toaster />
    </div>
  );
};

export default ProductReviewForm;