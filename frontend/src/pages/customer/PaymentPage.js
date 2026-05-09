import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookingAPI, paymentAPI } from '../../services/api';
import { Navbar } from '../../components/shared';
import { toast } from 'react-toastify';
import { FiCreditCard, FiSmartphone, FiDollarSign, FiLock, FiCheck } from 'react-icons/fi';

const PAYMENT_METHODS = [
  { id: 'CREDIT_CARD', label: 'Credit Card', icon: FiCreditCard, desc: 'Visa, Mastercard, Amex' },
  { id: 'DEBIT_CARD', label: 'Debit Card', icon: FiCreditCard, desc: 'All major banks' },
  { id: 'UPI', label: 'UPI', icon: FiSmartphone, desc: 'GPay, PhonePe, Paytm' },
  { id: 'NET_BANKING', label: 'Net Banking', icon: FiDollarSign, desc: 'All major banks' },
];

export default function PaymentPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [method, setMethod] = useState('UPI');
  const [processing, setProcessing] = useState(false);
  const [upiId, setUpiId] = useState('');
  const [step, setStep] = useState(1);

  useEffect(() => {
    bookingAPI.getById(bookingId).then(r => setBooking(r.data.data))
      .catch(() => toast.error('Booking not found')).finally(() => setLoading(false));
  }, [bookingId]);

  const handlePay = async () => {
    setProcessing(true);
    // Simulate processing delay for UX
    await new Promise(r => setTimeout(r, 2000));
    try {
      await paymentAPI.process({ bookingId: parseInt(bookingId), paymentMethod: method });
      setStep(2);
      setTimeout(() => navigate(`/booking-confirm/${bookingId}`), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed');
    } finally { setProcessing(false); }
  };

  if (loading) return <div><Navbar /><div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div></div>;

  if (step === 2) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
          <FiCheck size={48} className="text-green-600" />
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">Payment Successful!</h1>
        <p className="text-gray-500">Redirecting to confirmation...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-8">
          <FiLock className="text-green-600" size={20} />
          <h1 className="text-3xl font-black text-gray-900">Secure Payment</h1>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-5">
            {/* Payment Methods */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Select Payment Method</h2>
              <div className="grid grid-cols-2 gap-3">
                {PAYMENT_METHODS.map(({ id, label, icon: Icon, desc }) => (
                  <button key={id} onClick={() => setMethod(id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${method === id ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-200'}`}>
                    <Icon size={20} className={method === id ? 'text-blue-600' : 'text-gray-500'} />
                    <div className="font-semibold text-gray-900 text-sm mt-2">{label}</div>
                    <div className="text-gray-400 text-xs">{desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Details */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Payment Details</h2>
              {method === 'UPI' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1.5">UPI ID</label>
                    <input className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
                      placeholder="yourname@upi" value={upiId} onChange={e => setUpiId(e.target.value)} />
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <div className="text-5xl mb-2">📱</div>
                    <p className="text-sm text-gray-600 font-medium">Or scan QR code with any UPI app</p>
                    <div className="w-32 h-32 bg-white border-2 border-gray-200 rounded-xl mx-auto mt-3 flex items-center justify-center text-4xl">QR</div>
                  </div>
                </div>
              ) : (method === 'CREDIT_CARD' || method === 'DEBIT_CARD') ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1.5">Card Number</label>
                    <input className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
                      placeholder="1234 5678 9012 3456" maxLength={19} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-1.5">Expiry</label>
                      <input className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500" placeholder="MM/YY" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 mb-1.5">CVV</label>
                      <input className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500" placeholder="123" type="password" maxLength={3} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1.5">Cardholder Name</label>
                    <input className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500" placeholder="As on card" />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-600 mb-1.5">Select Bank</label>
                  {['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank'].map(bank => (
                    <div key={bank} className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:border-blue-400 cursor-pointer">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-xs font-bold text-blue-700">{bank[0]}</div>
                      <span className="text-sm font-medium text-gray-700">{bank}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button onClick={handlePay} disabled={processing}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl text-base transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              <FiLock size={16} />
              {processing ? (
                <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Processing...</span>
              ) : `Pay ₹${booking?.totalAmount?.toLocaleString('en-IN')}`}
            </button>
            <p className="text-center text-xs text-gray-400">🔒 256-bit SSL encrypted. Your payment is 100% secure.</p>
          </div>

          {/* Booking Summary */}
          {booking && (
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-4">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Booking Summary</h2>
                <div className="bg-blue-50 rounded-xl p-3 mb-4">
                  <div className="text-xs font-bold text-blue-600 mb-1">BOOKING REF</div>
                  <div className="font-black text-gray-900 text-lg tracking-wider">{booking.bookingReference}</div>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Hotel</span><span className="font-semibold text-right max-w-32 truncate">{booking.hotelName}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Room</span><span className="font-semibold">{booking.roomType} #{booking.roomNumber}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Check-in</span><span className="font-semibold">{booking.checkInDate}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Check-out</span><span className="font-semibold">{booking.checkOutDate}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Nights</span><span className="font-semibold">{booking.numberOfNights}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Guests</span><span className="font-semibold">{booking.numberOfGuests}</span></div>
                  <div className="border-t pt-3 flex justify-between text-base font-black">
                    <span>Total</span><span className="text-blue-700">₹{booking.totalAmount?.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
