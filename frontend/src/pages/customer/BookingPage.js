import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { roomAPI, bookingAPI } from '../../services/api';
import { Navbar } from '../../components/shared';
import { toast } from 'react-toastify';
import { FiCalendar, FiUsers, FiMapPin, FiInfo } from 'react-icons/fi';

export default function BookingPage() {
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    checkInDate: searchParams.get('checkIn') || '',
    checkOutDate: searchParams.get('checkOut') || '',
    numberOfGuests: 1,
    specialRequests: '',
  });

  useEffect(() => {
    roomAPI.getById(roomId).then(r => setRoom(r.data.data)).catch(() => toast.error('Room not found'))
      .finally(() => setLoading(false));
  }, [roomId]);

  const nights = form.checkInDate && form.checkOutDate
    ? Math.max(0, Math.ceil((new Date(form.checkOutDate) - new Date(form.checkInDate)) / 86400000))
    : 0;
  const total = room ? (room.currentPrice * nights) : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (nights <= 0) return toast.error('Check-out must be after check-in');
    setSubmitting(true);
    try {
      const { data } = await bookingAPI.create({ ...form, roomId: parseInt(roomId) });
      toast.success('Booking created!');
      navigate(`/payment/${data.data.id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally { setSubmitting(false); }
  };

  if (loading) return <div><Navbar /><div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-black text-gray-900 mb-8">Complete Your Booking</h1>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2"><FiCalendar /> Stay Details</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1.5">Check-In Date</label>
                    <input type="date" required className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      min={new Date().toISOString().split('T')[0]}
                      value={form.checkInDate} onChange={e => setForm({ ...form, checkInDate: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1.5">Check-Out Date</label>
                    <input type="date" required className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      min={form.checkInDate || new Date().toISOString().split('T')[0]}
                      value={form.checkOutDate} onChange={e => setForm({ ...form, checkOutDate: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1.5"><FiUsers className="inline mr-1" />Number of Guests</label>
                  <select className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
                    value={form.numberOfGuests} onChange={e => setForm({ ...form, numberOfGuests: parseInt(e.target.value) })}>
                    {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} Guest{n>1?'s':''}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1.5">Special Requests (Optional)</label>
                  <textarea rows={3} placeholder="e.g. Early check-in, extra pillows, quiet room..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 resize-none"
                    value={form.specialRequests} onChange={e => setForm({ ...form, specialRequests: e.target.value })} />
                </div>
                <div className="bg-blue-50 rounded-xl p-4 flex gap-3 text-sm text-blue-700">
                  <FiInfo size={16} className="flex-shrink-0 mt-0.5" />
                  <p>Free cancellation up to 24 hours before check-in. Payment will be processed on the next step.</p>
                </div>
                <button type="submit" disabled={submitting || nights <= 0}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-colors disabled:opacity-50 text-base">
                  {submitting ? 'Creating booking...' : `Proceed to Payment — ₹${total.toLocaleString('en-IN')}`}
                </button>
              </form>
            </div>
          </div>

          {/* Room Summary */}
          {room && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                <img src={room.imageUrl || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80'}
                  alt={room.roomType} className="w-full h-44 object-cover"
                  onError={e => { e.target.src = 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80'; }} />
                <div className="p-5">
                  <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full">{room.roomType}</span>
                  <h3 className="font-bold text-gray-900 text-lg mt-2">Room {room.roomNumber}</h3>
                  <p className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                    <FiMapPin size={12} /> {room.hotelName}, {room.hotelCity}
                  </p>
                  <div className="border-t border-gray-100 mt-4 pt-4 space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">Price/night</span><span className="font-semibold">₹{room.currentPrice?.toLocaleString('en-IN')}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Nights</span><span className="font-semibold">{nights}</span></div>
                    <div className="border-t pt-2 flex justify-between text-base font-black"><span>Total</span><span className="text-blue-700">₹{total.toLocaleString('en-IN')}</span></div>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 rounded-xl p-4 text-sm text-green-700 font-medium text-center">
                ✅ Free cancellation available
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
