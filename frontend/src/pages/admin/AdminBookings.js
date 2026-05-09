import React, { useState, useEffect } from 'react';
import { bookingAPI, userAPI } from '../../services/api';
import { AdminSidebar, StatusBadge } from '../../components/shared';
import { toast } from 'react-toastify';
import { FiSearch, FiCheck, FiLogIn, FiLogOut, FiX } from 'react-icons/fi';

// ==================== ADMIN BOOKINGS ====================
export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [page, setPage]         = useState(0);
  const [total, setTotal]       = useState(0);
  const [loading, setLoading]   = useState(true);
  const [status, setStatus]     = useState('');
  const [search, setSearch]     = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const params = { page, size: 15 };
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
    catch (err) { toast.error(err.response?.data?.message || 'Action failed'); }
  };

  const filtered = bookings.filter(b =>
    !search ||
    b.bookingReference?.toLowerCase().includes(search.toLowerCase()) ||
    b.customerName?.toLowerCase().includes(search.toLowerCase()) ||
    b.hotelName?.toLowerCase().includes(search.toLowerCase())
  );

  const STATUSES = ['','PENDING','CONFIRMED','CHECKED_IN','CHECKED_OUT','CANCELLED'];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900">Bookings</h1>
          <p className="text-gray-500 mt-1">Manage all hotel bookings</p>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15}/>
            <input className="pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 bg-white w-72"
              placeholder="Search by reference, guest, hotel..." value={search} onChange={e=>setSearch(e.target.value)}/>
          </div>
          <select className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-blue-500"
            value={status} onChange={e=>{ setStatus(e.target.value); setPage(0); }}>
            {STATUSES.map(s=><option key={s} value={s}>{s||'All Statuses'}</option>)}
          </select>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>{['Reference','Guest','Hotel / Room','Dates','Amount','Status','Actions'].map(h=>(
                <th key={h} className="text-left px-5 py-4 font-semibold text-gray-600 text-xs uppercase tracking-wide">{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan={7} className="text-center py-16"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"/></td></tr>
              : filtered.length===0 ? <tr><td colSpan={7} className="text-center py-16 text-gray-400">No bookings found</td></tr>
              : filtered.map(b=>(
                <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 font-black text-blue-700 text-xs tracking-wider">{b.bookingReference}</td>
                  <td className="px-5 py-4">
                    <div className="font-semibold text-gray-900">{b.customerName}</div>
                    <div className="text-gray-400 text-xs">{b.customerEmail}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-semibold text-gray-900">{b.hotelName}</div>
                    <div className="text-gray-400 text-xs">{b.roomType} #{b.roomNumber}</div>
                  </td>
                  <td className="px-5 py-4 text-gray-600 text-xs">
                    <div>{b.checkInDate}</div><div className="text-gray-400">→ {b.checkOutDate}</div>
                    <div className="text-gray-400">{b.numberOfNights} nights</div>
                  </td>
                  <td className="px-5 py-4 font-bold text-gray-900">₹{b.totalAmount?.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-4"><StatusBadge status={b.status}/></td>
                  <td className="px-5 py-4">
                    <div className="flex gap-1">
                      {b.status==='PENDING'   && <button onClick={()=>action(bookingAPI.confirm,b.id,'Confirmed')} title="Confirm" className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"><FiCheck size={13}/></button>}
                      {b.status==='CONFIRMED' && <button onClick={()=>action(bookingAPI.checkIn,b.id,'Checked in')} title="Check In" className="p-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100"><FiLogIn size={13}/></button>}
                      {b.status==='CHECKED_IN'&& <button onClick={()=>action(bookingAPI.checkOut,b.id,'Checked out')} title="Check Out" className="p-1.5 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100"><FiLogOut size={13}/></button>}
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
            <span className="px-4 py-2 text-sm text-gray-600">Page {page+1} of {total}</span>
            <button onClick={()=>setPage(p=>p+1)} disabled={page>=total-1} className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm disabled:opacity-40">Next →</button>
          </div>
        )}
      </main>
    </div>
  );
}

// ==================== ADMIN USERS ====================
export function AdminUsers() {
  const [users, setUsers]     = useState([]);
  const [page, setPage]       = useState(0);
  const [total, setTotal]     = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await userAPI.getAll({ page, size: 15 });
      setUsers(data.data?.content || []);
      setTotal(data.data?.totalPages || 0);
    } catch { toast.error('Failed to load users'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [page]);

  const changeRole = async (id, role) => {
    try { await userAPI.updateRole(id, role); toast.success('Role updated'); load(); }
    catch { toast.error('Failed to update role'); }
  };

  const toggleStatus = async (id, active) => {
    try { await userAPI.updateStatus(id, !active); toast.success('Status updated'); load(); }
    catch { toast.error('Failed to update status'); }
  };

  const filtered = users.filter(u =>
    !search ||
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const ROLE_COLORS = { ADMIN:'bg-purple-100 text-purple-700', STAFF:'bg-blue-100 text-blue-700', CUSTOMER:'bg-gray-100 text-gray-700' };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900">Users</h1>
          <p className="text-gray-500 mt-1">{users.length} registered users</p>
        </div>

        <div className="relative mb-6">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15}/>
          <input className="pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 bg-white w-80"
            placeholder="Search users..." value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>{['User','Email','Phone','Role','Status','Joined','Actions'].map(h=>(
                <th key={h} className="text-left px-5 py-4 font-semibold text-gray-600 text-xs uppercase tracking-wide">{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan={7} className="text-center py-16"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"/></td></tr>
              : filtered.length===0 ? <tr><td colSpan={7} className="text-center py-16 text-gray-400">No users found</td></tr>
              : filtered.map(u=>(
                <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-sm">
                        {u.firstName?.[0]}{u.lastName?.[0]}
                      </div>
                      <span className="font-semibold text-gray-900">{u.firstName} {u.lastName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-600">{u.email}</td>
                  <td className="px-5 py-4 text-gray-600">{u.phone||'—'}</td>
                  <td className="px-5 py-4">
                    <select value={u.role} onChange={e=>changeRole(u.id,e.target.value)}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full border-0 cursor-pointer ${ROLE_COLORS[u.role]}`}>
                      <option value="CUSTOMER">CUSTOMER</option>
                      <option value="STAFF">STAFF</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>
                  <td className="px-5 py-4">
                    <button onClick={()=>toggleStatus(u.id,u.active)}
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${u.active?'bg-green-100 text-green-700 hover:bg-green-200':'bg-red-100 text-red-700 hover:bg-red-200'}`}>
                      {u.active?'Active':'Inactive'}
                    </button>
                  </td>
                  <td className="px-5 py-4 text-gray-400 text-xs">{u.createdAt?.split('T')[0]}</td>
                  <td className="px-5 py-4">
                    <button onClick={()=>toggleStatus(u.id,u.active)} className={`p-1.5 rounded-lg text-xs ${u.active?'bg-red-50 text-red-500 hover:bg-red-100':'bg-green-50 text-green-600 hover:bg-green-100'}`}>
                      {u.active?<FiX size={13}/>:<FiCheck size={13}/>}
                    </button>
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
