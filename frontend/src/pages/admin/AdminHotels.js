import React, { useState, useEffect } from 'react';
import { hotelAPI } from '../../services/api';
import { AdminSidebar } from '../../components/shared';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiStar, FiMapPin, FiSearch } from 'react-icons/fi';

const EMPTY = { name:'', description:'', address:'', city:'', country:'', phone:'', email:'', starRating:3, imageUrl:'', amenities:'' };

export default function AdminHotels() {
  const [hotels, setHotels]   = useState([]);
  const [total, setTotal]     = useState(0);
  const [page, setPage]       = useState(0);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm]       = useState(EMPTY);
  const [saving, setSaving]   = useState(false);
  const [search, setSearch]   = useState('');

  const load = async (p = 0) => {
    setLoading(true);
    try {
      const { data } = await hotelAPI.getAll({ page: p, size: 10, sortBy: 'id' });
      setHotels(data.data.content || []);
      setTotal(data.data.totalPages || 0);
    } catch { toast.error('Failed to load hotels'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(page); }, [page]);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit   = (h) => {
    setEditing(h);
    setForm({ ...h, amenities: [...(h.amenities||[])].join(', ') });
    setModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    const payload = { ...form, amenities: form.amenities ? form.amenities.split(',').map(s=>s.trim()).filter(Boolean) : [] };
    try {
      if (editing) { await hotelAPI.update(editing.id, payload); toast.success('Hotel updated'); }
      else          { await hotelAPI.create(payload);            toast.success('Hotel created'); }
      setModal(false); load(page);
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this hotel?')) return;
    try { await hotelAPI.delete(id); toast.success('Hotel deleted'); load(page); }
    catch { toast.error('Delete failed'); }
  };

  const filtered = hotels.filter(h =>
    h.name.toLowerCase().includes(search.toLowerCase()) ||
    h.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Hotels</h1>
            <p className="text-gray-500 mt-1">{hotels.length} hotels managed</p>
          </div>
          <button onClick={openCreate} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors">
            <FiPlus size={18}/> Add Hotel
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
          <input className="w-full md:w-80 pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 bg-white"
            placeholder="Search hotels..." value={search} onChange={e=>setSearch(e.target.value)} />
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Hotel','City','Stars','Rooms','Rating','Status','Actions'].map(h=>(
                  <th key={h} className="text-left px-5 py-4 font-semibold text-gray-600 text-xs uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="text-center py-16"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"/></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-16 text-gray-400">No hotels found</td></tr>
              ) : filtered.map(h => (
                <tr key={h.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {h.imageUrl
                          ? <img src={h.imageUrl} alt="" className="w-full h-full object-cover" onError={e=>{e.target.style.display='none'}}/>
                          : <span className="text-xl">🏨</span>}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{h.name}</div>
                        <div className="text-gray-400 text-xs">{h.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="flex items-center gap-1 text-gray-600"><FiMapPin size={12}/>{h.city}, {h.country}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-0.5">
                      {[...Array(h.starRating||0)].map((_,i)=><FiStar key={i} size={12} className="fill-yellow-400 text-yellow-400"/>)}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-gray-700 font-medium">{h.availableRooms}<span className="text-gray-400">/{h.totalRooms}</span></span>
                  </td>
                  <td className="px-5 py-4">
                    {h.averageRating
                      ? <span className="flex items-center gap-1 text-yellow-600 font-semibold"><FiStar size={12} className="fill-yellow-400"/>{h.averageRating.toFixed(1)}</span>
                      : <span className="text-gray-400 text-xs">No reviews</span>}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${h.active?'bg-green-100 text-green-700':'bg-red-100 text-red-700'}`}>
                      {h.active?'Active':'Inactive'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button onClick={()=>openEdit(h)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><FiEdit2 size={15}/></button>
                      <button onClick={()=>handleDelete(h.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><FiTrash2 size={15}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {total > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            <button onClick={()=>setPage(p=>p-1)} disabled={page===0} className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm disabled:opacity-40 hover:border-blue-400">← Prev</button>
            <span className="px-4 py-2 text-sm text-gray-600">Page {page+1} of {total}</span>
            <button onClick={()=>setPage(p=>p+1)} disabled={page>=total-1} className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm disabled:opacity-40 hover:border-blue-400">Next →</button>
          </div>
        )}
      </main>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl my-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">{editing?'Edit Hotel':'Add New Hotel'}</h2>
              <button onClick={()=>setModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><FiX size={20}/></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-gray-600 mb-1.5">Hotel Name *</label>
                  <input required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="The Grand Palace"/>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1.5">City *</label>
                  <input required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500" value={form.city} onChange={e=>setForm({...form,city:e.target.value})} placeholder="Mumbai"/>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1.5">Country *</label>
                  <input required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500" value={form.country} onChange={e=>setForm({...form,country:e.target.value})} placeholder="India"/>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-gray-600 mb-1.5">Address *</label>
                  <input required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500" value={form.address} onChange={e=>setForm({...form,address:e.target.value})} placeholder="123 Marine Drive"/>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1.5">Phone</label>
                  <input className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="+91 9876543210"/>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1.5">Email</label>
                  <input type="email" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="info@hotel.com"/>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1.5">Star Rating</label>
                  <select className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500" value={form.starRating} onChange={e=>setForm({...form,starRating:parseInt(e.target.value)})}>
                    {[1,2,3,4,5].map(n=><option key={n} value={n}>{n} Star{n>1?'s':''}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1.5">Image URL</label>
                  <input className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500" value={form.imageUrl} onChange={e=>setForm({...form,imageUrl:e.target.value})} placeholder="https://..."/>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-gray-600 mb-1.5">Amenities <span className="font-normal text-gray-400">(comma-separated)</span></label>
                  <input className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500" value={form.amenities} onChange={e=>setForm({...form,amenities:e.target.value})} placeholder="Pool, Spa, WiFi, Gym, Restaurant"/>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-gray-600 mb-1.5">Description</label>
                  <textarea rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 resize-none" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="A luxurious hotel in the heart of the city..."/>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={()=>setModal(false)} className="flex-1 border-2 border-gray-200 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50">
                  {saving?'Saving...':editing?'Update Hotel':'Create Hotel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
