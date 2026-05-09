import React, { useState, useEffect } from 'react';
import { bookingAPI, roomAPI, hotelAPI, analyticsAPI } from '../../services/api';
import { StaffSidebar, StatusBadge } from '../../components/shared';
import { toast } from 'react-toastify';
import { FiLogIn, FiLogOut, FiHome, FiCalendar, FiUsers, FiSearch } from 'react-icons/fi';

// ==================== STAFF DASHBOARD ====================
export default function StaffDashboard() {
  const [stats, setStats]       = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([
      analyticsAPI.getDashboard().catch(()=>null),
      bookingAPI.getAll({ page:0, size:8, status:'CHECKED_IN' }).catch(()=>null),
    ]).then(([analytics, bk]) => {
      setStats(analytics?.data?.data);
      setBookings(bk?.data?.data?.content || []);
    }).finally(() => setLoading(false));
  }, []);

  const action = async (fn, id, label) => {
    try { await fn(id); toast.success(label); window.location.reload(); }
    catch (err) { toast.error(err.response?.data?.message || 'Action failed'); }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <StaffSidebar />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900">Staff Dashboard</h1>
          <p className="text-gray-500 mt-1">Today's overview</p>
        </div>

        {loading ? <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"/></div> : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label:'Total Bookings', value:stats?.totalBookings||0, icon:'📋', color:'bg-blue-50 text-blue-700' },
                { label:'Active Stays', value:stats?.activeBookings||0, icon:'🛎️', color:'bg-green-50 text-green-700' },
                { label:'Total Rooms', value:stats?.totalRooms||0, icon:'🏠', color:'bg-purple-50 text-purple-700' },
                { label:'Occupancy', value:`${stats?.occupancyRate?.toFixed(0)||0}%`, icon:'📊', color:'bg-orange-50 text-orange-700' },
              ].map(s=>(
                <div key={s.label} className={`${s.color} rounded-2xl p-5`}>
                  <div className="text-3xl mb-2">{s.icon}</div>
                  <div className="text-2xl font-black">{s.value}</div>
                  <div className="text-sm font-medium opacity-80">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="font-bold text-gray-900">Currently Checked-In Guests</h2>
              </div>
              {bookings.length === 0 ? (
                <div className="text-center py-12 text-gray-400">No active check-ins</div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>{['Guest','Reference','Room','Check-Out','Action'].map(h=>(
                      <th key={h} className="text-left px-5 py-3 font-semibold text-gray-600 text-xs uppercase">{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody>
                    {bookings.map(b=>(
                      <tr key={b.id} className="border-t border-gray-50 hover:bg-gray-50">
                        <td className="px-5 py-4 font-semibold text-gray-900">{b.customerName}</td>
                        <td className="px-5 py-4 text-blue-700 font-bold text-xs">{b.bookingReference}</td>
                        <td className="px-5 py-4 text-gray-600">{b.roomType} #{b.roomNumber}</td>
                        <td className="px-5 py-4 text-gray-600">{b.checkOutDate}</td>
                        <td className="px-5 py-4">
                          <button onClick={()=>action(bookingAPI.checkOut, b.id, 'Checked out!')}
                            className="flex items-center gap-1 bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-orange-200 transition-colors">
                            <FiLogOut size={12}/> Check Out
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

// ==================== STAFF BOOKINGS ====================
export function StaffBookings() {
  const [bookings, setBookings] = useState([]);
  const [page, setPage]         = useState(0);
  const [total, setTotal]       = useState(0);
  const [loading, setLoading]   = useState(true);
  const [status, setStatus]     = useState('');
  const [search, setSearch]     = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const params = { page, size: 12 };
      if (status) params.status = status;
      const { data } = await bookingAPI.getAll(params);
      setBookings(data.data?.content || []);
      setTotal(data.data?.totalPages || 0);
    } catch { toast.error('Failed to load bookings'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [page, status]);

  const action = async (fn, id, msg) => {
    try { await fn(id); toast.success(msg); load(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const filtered = bookings.filter(b =>
    !search ||
    b.bookingReference?.toLowerCase().includes(search.toLowerCase()) ||
    b.customerName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <StaffSidebar />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900">Bookings Management</h1>
          <p className="text-gray-500 mt-1">Handle check-ins and check-outs</p>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15}/>
            <input className="pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 bg-white w-72"
              placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)}/>
          </div>
          <select className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-blue-500"
            value={status} onChange={e=>{ setStatus(e.target.value); setPage(0); }}>
            {['','PENDING','CONFIRMED','CHECKED_IN','CHECKED_OUT','CANCELLED'].map(s=><option key={s} value={s}>{s||'All Statuses'}</option>)}
          </select>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>{['Reference','Guest','Hotel/Room','Dates','Amount','Status','Actions'].map(h=>(
                <th key={h} className="text-left px-5 py-4 font-semibold text-gray-600 text-xs uppercase">{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan={7} className="text-center py-16"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"/></td></tr>
              : filtered.length===0 ? <tr><td colSpan={7} className="text-center py-16 text-gray-400">No bookings</td></tr>
              : filtered.map(b=>(
                <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-5 py-4 font-black text-blue-700 text-xs">{b.bookingReference}</td>
                  <td className="px-5 py-4">
                    <div className="font-semibold text-gray-900">{b.customerName}</div>
                    <div className="text-gray-400 text-xs">{b.numberOfGuests} guests</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-semibold text-gray-900 text-xs">{b.hotelName}</div>
                    <div className="text-gray-400 text-xs">{b.roomType} #{b.roomNumber}</div>
                  </td>
                  <td className="px-5 py-4 text-xs text-gray-600">
                    <div>{b.checkInDate}</div><div className="text-gray-400">→ {b.checkOutDate}</div>
                  </td>
                  <td className="px-5 py-4 font-bold text-gray-900">₹{b.totalAmount?.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-4"><StatusBadge status={b.status}/></td>
                  <td className="px-5 py-4">
                    <div className="flex gap-1">
                      {b.status==='PENDING'    && <button onClick={()=>action(bookingAPI.confirm, b.id,'Confirmed!')} className="bg-blue-50 text-blue-600 text-xs font-semibold px-2.5 py-1 rounded-lg hover:bg-blue-100">Confirm</button>}
                      {b.status==='CONFIRMED'  && <button onClick={()=>action(bookingAPI.checkIn, b.id,'Checked in!')} className="bg-green-50 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-lg hover:bg-green-100 flex items-center gap-1"><FiLogIn size={11}/>Check In</button>}
                      {b.status==='CHECKED_IN' && <button onClick={()=>action(bookingAPI.checkOut,b.id,'Checked out!')} className="bg-orange-50 text-orange-700 text-xs font-semibold px-2.5 py-1 rounded-lg hover:bg-orange-100 flex items-center gap-1"><FiLogOut size={11}/>Check Out</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {total > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            <button onClick={()=>setPage(p=>p-1)} disabled={page===0} className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm disabled:opacity-40">← Prev</button>
            <span className="px-4 py-2 text-sm text-gray-600">Page {page+1}</span>
            <button onClick={()=>setPage(p=>p+1)} disabled={page>=total-1} className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm disabled:opacity-40">Next →</button>
          </div>
        )}
      </main>
    </div>
  );
}

// ==================== STAFF ROOMS ====================
export function StaffRooms() {
  const [hotels, setHotels]     = useState([]);
  const [rooms, setRooms]       = useState([]);
  const [hotel, setHotel]       = useState('');
  const [loading, setLoading]   = useState(false);

  useEffect(() => { hotelAPI.getAll({page:0,size:100}).then(r=>setHotels(r.data.data?.content||[])).catch(()=>{}); }, []);
  useEffect(() => {
    if (!hotel) return;
    setLoading(true);
    roomAPI.getByHotel(hotel,{page:0,size:50}).then(r=>setRooms(r.data.data?.content||[])).catch(()=>{}).finally(()=>setLoading(false));
  }, [hotel]);

  const changeStatus = async (id, status) => {
    try { await roomAPI.updateStatus(id, status); toast.success('Status updated');
      setRooms(prev => prev.map(r => r.id===id ? {...r, status} : r));
    } catch { toast.error('Failed to update status'); }
  };

  const STATUS_OPTIONS = ['AVAILABLE','OCCUPIED','MAINTENANCE','RESERVED'];
  const STATUS_COLORS  = { AVAILABLE:'bg-green-100 text-green-700', OCCUPIED:'bg-red-100 text-red-700', MAINTENANCE:'bg-yellow-100 text-yellow-700', RESERVED:'bg-blue-100 text-blue-700' };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <StaffSidebar />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900">Room Status</h1>
          <p className="text-gray-500 mt-1">Update room availability</p>
        </div>

        <div className="mb-6">
          <select className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-blue-500 min-w-72"
            value={hotel} onChange={e=>setHotel(e.target.value)}>
            <option value="">— Select a hotel —</option>
            {hotels.map(h=><option key={h.id} value={h.id}>{h.name} ({h.city})</option>)}
          </select>
        </div>

        {loading ? <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"/></div>
        : !hotel ? <div className="text-center py-24 text-gray-400"><div className="text-6xl mb-4">🏨</div><p>Select a hotel to manage rooms</p></div>
        : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {rooms.map(r=>(
              <div key={r.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-black text-gray-900">#{r.roomNumber}</span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[r.status]}`}>{r.status}</span>
                </div>
                <div className="text-sm text-gray-500 mb-1">{r.roomType}</div>
                <div className="text-sm text-gray-500 mb-4">Floor {r.floorNumber} · {r.capacity} guests</div>
                <div className="text-blue-700 font-bold mb-4">₹{r.currentPrice?.toLocaleString('en-IN')}/night</div>
                <select value={r.status} onChange={e=>changeStatus(r.id, e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
                  {STATUS_OPTIONS.map(s=><option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
