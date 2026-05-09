import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { bookingAPI, reviewAPI } from '../../services/api';
import { Navbar, StatusBadge } from '../../components/shared';
import { toast } from 'react-toastify';
import { FiStar, FiMapPin, FiX } from 'react-icons/fi';

export default function MyBookingsPage() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [page, setPage]         = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [reviewModal, setReviewModal] = useState(null);
  const [reviewForm, setReviewForm]   = useState({ rating:5, comment:'' });

  useEffect(() => {
    bookingAPI.getMyBookings({ page, size:10 })
      .then(r => { setBookings(r.data.data?.content||[]); setTotalPages(r.data.data?.totalPages||0); })
      .catch(() => toast.error('Failed to load bookings'))
      .finally(() => setLoading(false));
  }, [page]);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try { await bookingAPI.cancel(id); toast.success('Booking cancelled');
      setBookings(b => b.map(x => x.id===id ? {...x, status:'CANCELLED'} : x));
    } catch (err) { toast.error(err.response?.data?.message||'Cancel failed'); }
  };

  const submitReview = async () => {
    try { await reviewAPI.create({ roomId:reviewModal.roomId, bookingId:reviewModal.id, ...reviewForm });
      toast.success('Review submitted!'); setReviewModal(null);
    } catch (err) { toast.error(err.response?.data?.message||'Review failed'); }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-black text-gray-900 mb-8">My Bookings</h1>
        {loading ? (
          <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"/></div>
        ) : bookings.length===0 ? (
          <div className="text-center py-24">
            <div className="text-7xl mb-4">🏨</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No bookings yet</h3>
            <Link to="/hotels" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors">Browse Hotels</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map(b => (
              <div key={b.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-black text-blue-700 text-lg tracking-wider">{b.bookingReference}</span>
                      <StatusBadge status={b.status}/>
                    </div>
                    <h3 className="font-bold text-gray-900 text-xl">{b.hotelName}</h3>
                    <p className="text-gray-500 text-sm flex items-center gap-1 mt-1"><FiMapPin size={12}/>{b.hotelCity} · {b.roomType} #{b.roomNumber}</p>
                    <div className="flex gap-4 mt-3 text-sm text-gray-600 flex-wrap">
                      <span>📅 {b.checkInDate} → {b.checkOutDate}</span>
                      <span>🌙 {b.numberOfNights} nights</span>
                      <span>👥 {b.numberOfGuests} guests</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <div className="text-2xl font-black text-blue-700">₹{b.totalAmount?.toLocaleString('en-IN')}</div>
                    <div className="flex gap-2 flex-wrap justify-end">
                      {b.status==='PENDING'   && <button onClick={()=>navigate(`/payment/${b.id}`)} className="bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-blue-700">Pay Now</button>}
                      {(b.status==='PENDING'||b.status==='CONFIRMED') && <button onClick={()=>handleCancel(b.id)} className="bg-red-50 text-red-600 text-xs font-semibold px-4 py-2 rounded-lg hover:bg-red-100">Cancel</button>}
                      {b.status==='CHECKED_OUT' && <button onClick={()=>setReviewModal(b)} className="bg-yellow-50 text-yellow-700 text-xs font-semibold px-4 py-2 rounded-lg hover:bg-yellow-100 flex items-center gap-1"><FiStar size={12}/> Review</button>}
                      {b.status==='CONFIRMED'   && <Link to={`/booking-confirm/${b.id}`} className="bg-gray-100 text-gray-700 text-xs font-semibold px-4 py-2 rounded-lg hover:bg-gray-200">Invoice</Link>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {totalPages>1 && (
              <div className="flex justify-center gap-2 mt-6">
                <button onClick={()=>setPage(p=>p-1)} disabled={page===0} className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm disabled:opacity-40">← Prev</button>
                <span className="px-4 py-2 text-sm text-gray-600">{page+1}/{totalPages}</span>
                <button onClick={()=>setPage(p=>p+1)} disabled={page>=totalPages-1} className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm disabled:opacity-40">Next →</button>
              </div>
            )}
          </div>
        )}
      </div>

      {reviewModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Leave a Review</h3>
              <button onClick={()=>setReviewModal(null)}><FiX size={20} className="text-gray-400"/></button>
            </div>
            <p className="text-sm text-gray-500 mb-4">{reviewModal.hotelName} · {reviewModal.roomType}</p>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-600 mb-2">Rating</label>
              <div className="flex gap-2">
                {[1,2,3,4,5].map(n=>(
                  <button key={n} onClick={()=>setReviewForm({...reviewForm,rating:n})}>
                    <FiStar size={28} className={n<=reviewForm.rating?'fill-yellow-400 text-yellow-400':'text-gray-300'}/>
                  </button>
                ))}
              </div>
            </div>
            <textarea rows={4} placeholder="Share your experience..." className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 mb-4 resize-none"
              value={reviewForm.comment} onChange={e=>setReviewForm({...reviewForm,comment:e.target.value})}/>
            <button onClick={submitReview} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors">Submit Review</button>
          </div>
        </div>
      )}
    </div>
  );
}
