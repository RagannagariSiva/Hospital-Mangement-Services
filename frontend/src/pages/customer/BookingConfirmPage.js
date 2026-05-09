import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { bookingAPI, reviewAPI } from '../../services/api';
import { Navbar, StatusBadge } from '../../components/shared';
import { toast } from 'react-toastify';
import { FiCheck, FiDownload, FiCalendar, FiMapPin, FiUser, FiStar, FiX } from 'react-icons/fi';

// ==================== BOOKING CONFIRM ====================
export default function BookingConfirmPage() {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    bookingAPI.getById(bookingId).then(r => setBooking(r.data.data)).catch(() => {});
  }, [bookingId]);

  const printInvoice = () => window.print();

  if (!booking) return <div><Navbar /><div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Success Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiCheck size={40} className="text-green-600" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">Booking Confirmed! 🎉</h1>
          <p className="text-gray-500">Your booking has been confirmed. Check your email for details.</p>
        </div>

        {/* Invoice Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden" id="invoice">
          <div className="bg-gradient-to-r from-blue-700 to-blue-900 p-6 text-white">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-blue-200 text-sm mb-1">BOOKING REFERENCE</div>
                <div className="text-2xl font-black tracking-widest">{booking.bookingReference}</div>
              </div>
              <div className="text-right">
                <div className="text-blue-200 text-sm">Status</div>
                <div className="bg-green-500 text-white text-sm font-bold px-3 py-1 rounded-full mt-1">{booking.status}</div>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-xs font-bold text-gray-400 uppercase mb-1 flex items-center gap-1"><FiMapPin size={10} /> Hotel</div>
                <div className="font-bold text-gray-900">{booking.hotelName}</div>
                <div className="text-sm text-gray-500">{booking.hotelCity}</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-xs font-bold text-gray-400 uppercase mb-1">Room</div>
                <div className="font-bold text-gray-900">{booking.roomType}</div>
                <div className="text-sm text-gray-500">#{booking.roomNumber}</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-xs font-bold text-gray-400 uppercase mb-1 flex items-center gap-1"><FiCalendar size={10} /> Check-In</div>
                <div className="font-bold text-gray-900">{booking.checkInDate}</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-xs font-bold text-gray-400 uppercase mb-1 flex items-center gap-1"><FiCalendar size={10} /> Check-Out</div>
                <div className="font-bold text-gray-900">{booking.checkOutDate}</div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Duration</span><span className="font-semibold">{booking.numberOfNights} nights</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Guests</span><span className="font-semibold">{booking.numberOfGuests}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Guest Name</span><span className="font-semibold">{booking.customerName}</span></div>
              <div className="flex justify-between text-lg font-black border-t pt-3">
                <span>Total Paid</span>
                <span className="text-blue-700">₹{booking.totalAmount?.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-6 py-4 flex gap-3">
            <button onClick={printInvoice}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors">
              <FiDownload size={15} /> Download Invoice
            </button>
            <Link to="/bookings"
              className="flex-1 bg-white border-2 border-gray-200 hover:border-blue-400 text-gray-700 font-semibold py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors">
              View All Bookings
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link to="/hotels" className="text-blue-600 hover:underline font-medium text-sm">← Browse more hotels</Link>
        </div>
      </div>
    </div>
  );
}

// ==================== MY BOOKINGS ====================
export function MyBookingsPage() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [reviewModal, setReviewModal] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    bookingAPI.getMyBookings({ page, size: 10 })
      .then(r => { setBookings(r.data.data?.content || []); setTotalPages(r.data.data?.totalPages || 0); })
      .catch(() => toast.error('Failed to load bookings'))
      .finally(() => setLoading(false));
  }, [page]);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await bookingAPI.cancel(id);
      toast.success('Booking cancelled');
      setBookings(b => b.map(x => x.id === id ? { ...x, status: 'CANCELLED' } : x));
    } catch (err) { toast.error(err.response?.data?.message || 'Cancel failed'); }
  };

  const submitReview = async () => {
    try {
      await reviewAPI.create({ roomId: reviewModal.roomId, bookingId: reviewModal.id, ...reviewForm });
      toast.success('Review submitted!');
      setReviewModal(null);
    } catch (err) { toast.error(err.response?.data?.message || 'Review failed'); }
  };

  const statusColor = { PENDING: 'yellow', CONFIRMED: 'blue', CHECKED_IN: 'green', CHECKED_OUT: 'gray', CANCELLED: 'red' };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-black text-gray-900 mb-8">My Bookings</h1>

        {loading ? (
          <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-7xl mb-4">🏨</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No bookings yet</h3>
            <p className="text-gray-400 mb-6">Start exploring hotels and make your first booking!</p>
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
                      <StatusBadge status={b.status} />
                    </div>
                    <h3 className="font-bold text-gray-900 text-xl">{b.hotelName}</h3>
                    <p className="text-gray-500 text-sm flex items-center gap-1 mt-1"><FiMapPin size={12} />{b.hotelCity} · {b.roomType} #{b.roomNumber}</p>
                    <div className="flex gap-4 mt-3 text-sm text-gray-600">
                      <span>📅 {b.checkInDate} → {b.checkOutDate}</span>
                      <span>🌙 {b.numberOfNights} nights</span>
                      <span>👥 {b.numberOfGuests} guests</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <div className="text-2xl font-black text-blue-700">₹{b.totalAmount?.toLocaleString('en-IN')}</div>
                    <div className="flex gap-2 flex-wrap justify-end">
                      {b.status === 'PENDING' && (
                        <button onClick={() => navigate(`/payment/${b.id}`)}
                          className="bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">Pay Now</button>
                      )}
                      {(b.status === 'PENDING' || b.status === 'CONFIRMED') && (
                        <button onClick={() => handleCancel(b.id)}
                          className="bg-red-50 text-red-600 text-xs font-semibold px-4 py-2 rounded-lg hover:bg-red-100 transition-colors">Cancel</button>
                      )}
                      {b.status === 'CHECKED_OUT' && (
                        <button onClick={() => setReviewModal(b)}
                          className="bg-yellow-50 text-yellow-700 text-xs font-semibold px-4 py-2 rounded-lg hover:bg-yellow-100 transition-colors flex items-center gap-1">
                          <FiStar size={12} /> Review
                        </button>
                      )}
                      {b.status === 'CONFIRMED' && (
                        <Link to={`/booking-confirm/${b.id}`}
                          className="bg-gray-100 text-gray-700 text-xs font-semibold px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                          View Invoice
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                <button onClick={() => setPage(p => p - 1)} disabled={page === 0} className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm disabled:opacity-40">← Prev</button>
                <span className="px-4 py-2 text-sm text-gray-600">{page + 1} / {totalPages}</span>
                <button onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1} className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm disabled:opacity-40">Next →</button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {reviewModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Leave a Review</h3>
              <button onClick={() => setReviewModal(null)}><FiX size={20} className="text-gray-400" /></button>
            </div>
            <p className="text-sm text-gray-500 mb-4">{reviewModal.hotelName} · {reviewModal.roomType}</p>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-600 mb-2">Rating</label>
              <div className="flex gap-2">
                {[1,2,3,4,5].map(n => (
                  <button key={n} onClick={() => setReviewForm({ ...reviewForm, rating: n })}>
                    <FiStar size={28} className={n <= reviewForm.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
                  </button>
                ))}
              </div>
            </div>
            <textarea rows={4} placeholder="Share your experience..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 mb-4"
              value={reviewForm.comment} onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })} />
            <button onClick={submitReview}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors">
              Submit Review
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
