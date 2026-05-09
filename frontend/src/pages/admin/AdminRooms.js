import React, { useState, useEffect } from 'react';
import { roomAPI, hotelAPI } from '../../services/api';
import { AdminSidebar } from '../../components/shared';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';

const TYPES = ['SINGLE','DOUBLE','TWIN','SUITE','DELUXE','PRESIDENTIAL'];
const EMPTY = { hotelId:'', roomNumber:'', roomType:'DOUBLE', capacity:2, basePrice:'', floorNumber:1, imageUrl:'', description:'', amenities:'' };

export default function AdminRooms() {
  const [rooms, setRooms]     = useState([]);
  const [hotels, setHotels]   = useState([]);
  const [page, setPage]       = useState(0);
  const [total, setTotal]     = useState(0);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm]       = useState(EMPTY);
  const [saving, setSaving]   = useState(false);
  const [filterHotel, setFilterHotel] = useState('');

  useEffect(() => { hotelAPI.getAll({page:0,size:100}).then(r=>setHotels(r.data.data?.content||[])).catch(()=>{}); }, []);
  useEffect(() => { load(); }, [page, filterHotel]);

  const load = async () => {
    setLoading(true);
    try {
      let data;
      if (filterHotel) {
        const r = await roomAPI.getByHotel(filterHotel, { page, size: 12 });
        data = r.data.data;
      } else {
        // fetch all by loading first hotel or show empty
        setRooms([]); setTotal(0); setLoading(false); return;
      }
      setRooms(data.content || []); setTotal(data.totalPages || 0);
    } catch { toast.error('Failed to load rooms'); }
    finally { setLoading(false); }
  };

  const openCreate = () => { setEditing(null); setForm({...EMPTY, hotelId: filterHotel||''}); setModal(true); };
  const openEdit   = (r) => { setEditing(r); setForm({...r, hotelId:r.hotelId, amenities:[...(r.amenities||[])].join(', ')}); setModal(true); };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    const payload = { ...form, capacity:parseInt(form.capacity), basePrice:parseFloat(form.basePrice), floorNumber:parseInt(form.floorNumber), hotelId:parseInt(form.hotelId), amenities: form.amenities?form.amenities.split(',').map(s=>s.trim()).filter(Boolean):[] };
    try {
      if (editing) { await roomAPI.update(editing.id, payload); toast.success('Room updated'); }
      else         { await roomAPI.create(payload);             toast.success('Room created'); }
      setModal(false); load();
    } catch (err) { toast.error(err.response?.data?.message||'Save failed'); }
    finally { setSaving(false); }
  };

  const STATUS_COLORS = { AVAILABLE:'bg-green-100 text-green-700', OCCUPIED:'bg-red-100 text-red-700', MAINTENANCE:'bg-yellow-100 text-yellow-700', RESERVED:'bg-blue-100 text-blue-700' };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div><h1 className="text-3xl font-black text-gray-900">Rooms</h1><p className="text-gray-500 mt-1">Manage hotel rooms</p></div>
          <button onClick={openCreate} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors"><FiPlus size={18}/> Add Room</button>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <select className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 bg-white min-w-64"
            value={filterHotel} onChange={e=>{ setFilterHotel(e.target.value); setPage(0); }}>
            <option value="">— Select a hotel to view rooms —</option>
            {hotels.map(h=><option key={h.id} value={h.id}>{h.name} ({h.city})</option>)}
          </select>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>{['Room No.','Hotel','Type','Capacity','Price/Night','Floor','Status','Actions'].map(h=>(
                <th key={h} className="text-left px-5 py-4 font-semibold text-gray-600 text-xs uppercase tracking-wide">{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan={8} className="text-center py-16"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"/></td></tr>
              : !filterHotel ? <tr><td colSpan={8} className="text-center py-16 text-gray-400">Select a hotel to view rooms</td></tr>
              : rooms.length===0 ? <tr><td colSpan={8} className="text-center py-16 text-gray-400">No rooms found</td></tr>
              : rooms.map(r=>(
                <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 font-bold text-gray-900">#{r.roomNumber}</td>
                  <td className="px-5 py-4 text-gray-600">{r.hotelName}</td>
                  <td className="px-5 py-4"><span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full">{r.roomType}</span></td>
                  <td className="px-5 py-4 text-gray-600">👥 {r.capacity}</td>
                  <td className="px-5 py-4 font-bold text-blue-700">₹{r.currentPrice?.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-4 text-gray-600">Floor {r.floorNumber}</td>
                  <td className="px-5 py-4"><span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[r.status]||'bg-gray-100 text-gray-700'}`}>{r.status}</span></td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button onClick={()=>openEdit(r)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><FiEdit2 size={15}/></button>
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

      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl my-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">{editing?'Edit Room':'Add New Room'}</h2>
              <button onClick={()=>setModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><FiX size={20}/></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1.5">Hotel *</label>
                  <select required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500" value={form.hotelId} onChange={e=>setForm({...form,hotelId:e.target.value})}>
                    <option value="">Select hotel</option>
                    {hotels.map(h=><option key={h.id} value={h.id}>{h.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1.5">Room Number *</label>
                  <input required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500" value={form.roomNumber} onChange={e=>setForm({...form,roomNumber:e.target.value})} placeholder="101"/>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1.5">Room Type *</label>
                  <select className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500" value={form.roomType} onChange={e=>setForm({...form,roomType:e.target.value})}>
                    {TYPES.map(t=><option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1.5">Capacity *</label>
                  <input type="number" min={1} max={10} required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500" value={form.capacity} onChange={e=>setForm({...form,capacity:e.target.value})}/>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1.5">Base Price (₹) *</label>
                  <input type="number" min={0} required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500" value={form.basePrice} onChange={e=>setForm({...form,basePrice:e.target.value})} placeholder="5000"/>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1.5">Floor Number</label>
                  <input type="number" min={1} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500" value={form.floorNumber} onChange={e=>setForm({...form,floorNumber:e.target.value})}/>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-gray-600 mb-1.5">Image URL</label>
                  <input className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500" value={form.imageUrl} onChange={e=>setForm({...form,imageUrl:e.target.value})} placeholder="https://images.unsplash.com/..."/>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-gray-600 mb-1.5">Amenities <span className="font-normal text-gray-400">(comma-separated)</span></label>
                  <input className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500" value={form.amenities} onChange={e=>setForm({...form,amenities:e.target.value})} placeholder="WiFi, AC, TV, Mini Bar"/>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-gray-600 mb-1.5">Description</label>
                  <textarea rows={2} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 resize-none" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={()=>setModal(false)} className="flex-1 border-2 border-gray-200 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl disabled:opacity-50">
                  {saving?'Saving...':editing?'Update Room':'Create Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
