import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { roomAPI } from '../../services/api';

const NAVY  = '#0c1f3a';
const GOLD  = '#b8973a';
const GOLD2 = '#d4af5a';
const F     = "'Inter', system-ui, -apple-system, sans-serif";
const API   = 'http://localhost:8080/api';

const ROOM_FALLBACK = 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80';

/* ── Royal Grand Crown Logo ── */
function RGLogo({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill={NAVY}/>
      <path d="M8 27 L13 14 L19 22 L24 9 L29 22 L35 14 L40 27 L40 30 L8 30Z" fill={GOLD}/>
      <circle cx="8"  cy="27" r="2.5" fill={GOLD2}/>
      <circle cx="24" cy="9"  r="2.5" fill={GOLD2}/>
      <circle cx="40" cy="27" r="2.5" fill={GOLD2}/>
      <rect x="9" y="30" width="30" height="13" rx="1.5" fill="white" fillOpacity="0.93"/>
      <path d="M20 43 L20 36 Q24 31.5 28 36 L28 43Z" fill={NAVY}/>
      <rect x="11" y="32" width="6" height="4.5" rx="1" fill={GOLD} fillOpacity="0.85"/>
      <rect x="31" y="32" width="6" height="4.5" rx="1" fill={GOLD} fillOpacity="0.85"/>
    </svg>
  );
}

/* ── Royal Grand Navbar (standalone, no external import needed) ── */
function RGNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
      background: 'rgba(255,255,255,0.97)',
      borderBottom: '1px solid #e5e0d5',
      boxShadow: scrolled ? '0 2px 20px rgba(12,31,58,0.10)' : '0 1px 4px rgba(12,31,58,0.04)',
      transition: 'box-shadow 0.3s',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
          <RGLogo size={40}/>
          <div>
            <div style={{ fontFamily: F, fontSize: 19, fontWeight: 800, color: NAVY, lineHeight: 1.1, letterSpacing: '-0.3px' }}>Royal Grand</div>
            <div style={{ fontFamily: F, fontSize: 9, letterSpacing: '2.8px', textTransform: 'uppercase', color: GOLD }}>Luxury Hotels</div>
          </div>
        </a>
        {/* Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {[['Hotels', '/hotels'], ['Search', '/search']].map(([l, h]) => (
            <a key={l} href={h} style={{ padding: '8px 16px', fontFamily: F, fontSize: 14, fontWeight: 500, color: NAVY, textDecoration: 'none' }}>{l}</a>
          ))}
          {user ? (
            <>
              <a href={user.role === 'ADMIN' ? '/admin' : user.role === 'STAFF' ? '/staff' : '/bookings'}
                style={{ padding: '8px 16px', fontFamily: F, fontSize: 14, color: NAVY, textDecoration: 'none', fontWeight: 500 }}>{user.firstName}</a>
              <button onClick={() => { localStorage.clear(); window.location.href = '/'; }}
                style={{ padding: '9px 20px', border: `1.5px solid ${NAVY}`, borderRadius: 8, background: 'transparent', fontFamily: F, fontSize: 13, fontWeight: 600, color: NAVY, cursor: 'pointer' }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <a href="/login" style={{ padding: '9px 20px', border: `1.5px solid ${NAVY}`, borderRadius: 8, fontFamily: F, fontSize: 13, fontWeight: 600, color: NAVY, textDecoration: 'none' }}>Login</a>
              <a href="/register" style={{ padding: '9px 20px', background: GOLD, borderRadius: 8, fontFamily: F, fontSize: 13, fontWeight: 700, color: '#fff', textDecoration: 'none', marginLeft: 6 }}>Sign Up</a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

const ROOM_TYPES = ['SINGLE', 'DOUBLE', 'TWIN', 'SUITE', 'DELUXE', 'PRESIDENTIAL'];

export default function SearchPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [rooms, setRooms]         = useState([]);
  const [loading, setLoading]     = useState(false);
  const [page, setPage]           = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const today    = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [filters, setFilters] = useState({
    checkIn:  params.get('checkIn')  || '',
    checkOut: params.get('checkOut') || '',
    type:     '',
    maxPrice: '',
    capacity: params.get('guests') || '',
  });

  useEffect(() => {
    fetchRooms(filters.checkIn || today, filters.checkOut || tomorrow, 0);
  }, []);

  const fetchRooms = async (ci, co, pg = page) => {
    setLoading(true);
    try {
      const p = { checkIn: ci, checkOut: co, page: pg, size: 9 };
      if (filters.type)     p.type     = filters.type;
      if (filters.maxPrice) p.maxPrice = filters.maxPrice;
      if (filters.capacity) p.capacity = filters.capacity;
      const { data } = await roomAPI.search(p);
      setRooms(data.data?.content || []);
      setTotalPages(data.data?.totalPages || 0);
      setPage(pg);
    } catch { setRooms([]); }
    finally { setLoading(false); }
  };

  const handleSearch = e => {
    e.preventDefault();
    fetchRooms(filters.checkIn || today, filters.checkOut || tomorrow, 0);
  };

  /* ── shared input style ── */
  const inp = { border: 'none', outline: 'none', fontSize: 14, fontFamily: F, fontWeight: 500, color: NAVY, background: 'transparent', width: '100%' };
  const fieldLabel = { fontFamily: F, fontSize: 10, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#9ca3af', marginBottom: 5, display: 'block' };

  return (
    <div style={{ minHeight: '100vh', background: '#f8f6f1', fontFamily: F }}>
      <RGNavbar/>

      {/* ── Search Header ── */}
      <div style={{ paddingTop: 68 }}>
        <div style={{ background: NAVY, padding: '52px 7vw 40px' }}>
          <h1 style={{ fontFamily: F, fontSize: 'clamp(26px,4vw,38px)', fontWeight: 900, color: '#fff', textAlign: 'center', marginBottom: 8, letterSpacing: '-0.5px' }}>Find Available Rooms</h1>
          <p style={{ fontFamily: F, fontSize: 15, color: 'rgba(255,255,255,0.65)', textAlign: 'center', marginBottom: 32 }}>Search across 500+ premium hotels across India</p>

          {/* Search bar */}
          <form onSubmit={handleSearch}>
            <div style={{ maxWidth: 900, margin: '0 auto', background: '#fff', borderRadius: 14, overflow: 'hidden', display: 'flex', alignItems: 'stretch', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
              <div style={{ flex: 1, padding: '16px 22px', borderRight: '1px solid #e5e0d5' }}>
                <label style={fieldLabel}>Check In</label>
                <input type="date" style={inp} min={today}
                  value={filters.checkIn}
                  onChange={e => setFilters({ ...filters, checkIn: e.target.value })}/>
              </div>
              <div style={{ flex: 1, padding: '16px 22px', borderRight: '1px solid #e5e0d5' }}>
                <label style={fieldLabel}>Check Out</label>
                <input type="date" style={inp} min={filters.checkIn || today}
                  value={filters.checkOut}
                  onChange={e => setFilters({ ...filters, checkOut: e.target.value })}/>
              </div>
              <div style={{ padding: '16px 22px', borderRight: '1px solid #e5e0d5', minWidth: 110 }}>
                <label style={fieldLabel}>Guests</label>
                <input type="number" min="1" max="10" placeholder="1" style={{ ...inp, width: 60 }}
                  value={filters.capacity}
                  onChange={e => setFilters({ ...filters, capacity: e.target.value })}/>
              </div>
              <button type="button"
                onClick={() => setShowFilters(f => !f)}
                style={{ padding: '0 20px', background: 'transparent', border: 'none', borderRight: '1px solid #e5e0d5', fontFamily: F, fontSize: 13, fontWeight: 600, color: showFilters ? GOLD : '#6b7280', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>
                Filters
              </button>
              <button type="submit"
                style={{ padding: '0 32px', background: GOLD, color: '#fff', border: 'none', fontFamily: F, fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                Search
              </button>
            </div>

            {/* Filters panel */}
            {showFilters && (
              <div style={{ maxWidth: 900, margin: '12px auto 0', background: '#fff', borderRadius: 14, padding: '24px 28px', boxShadow: '0 8px 32px rgba(0,0,0,0.15)', display: 'flex', gap: 32, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <div style={{ flex: 1, minWidth: 240 }}>
                  <label style={{ ...fieldLabel, color: '#6b7280' }}>Room Type</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
                    {ROOM_TYPES.map(t => (
                      <button key={t} type="button"
                        onClick={() => setFilters({ ...filters, type: filters.type === t ? '' : t })}
                        style={{ padding: '6px 14px', borderRadius: 20, border: `1.5px solid ${filters.type === t ? GOLD : '#e5e0d5'}`, background: filters.type === t ? '#fffbf0' : '#fff', fontFamily: F, fontSize: 12, fontWeight: 600, color: filters.type === t ? GOLD : '#6b7280', cursor: 'pointer', transition: 'all 0.2s' }}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ minWidth: 180 }}>
                  <label style={{ ...fieldLabel, color: '#6b7280' }}>Max Price / Night (Rs.)</label>
                  <input type="number" placeholder="e.g. 10000"
                    style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e5e0d5', borderRadius: 8, fontFamily: F, fontSize: 14, color: NAVY, outline: 'none', marginTop: 4 }}
                    value={filters.maxPrice}
                    onFocus={e => e.target.style.borderColor = GOLD}
                    onBlur={e => e.target.style.borderColor = '#e5e0d5'}
                    onChange={e => setFilters({ ...filters, maxPrice: e.target.value })}/>
                </div>
                <button type="button"
                  onClick={() => setFilters({ ...filters, type: '', maxPrice: '' })}
                  style={{ background: 'none', border: 'none', fontFamily: F, fontSize: 13, color: '#ef4444', fontWeight: 600, cursor: 'pointer', paddingBottom: 2 }}>
                  Clear filters
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* ── Results ── */}
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '48px 7vw' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '80px 0' }}>
            <div style={{ width: 44, height: 44, border: `3px solid #e0ddd8`, borderTopColor: NAVY, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}/>
          </div>
        ) : rooms.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#f0ece3', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <svg width="32" height="32" fill="none" stroke={GOLD} strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </div>
            <h3 style={{ fontFamily: F, fontSize: 22, fontWeight: 700, color: NAVY, marginBottom: 10 }}>No rooms found</h3>
            <p style={{ fontFamily: F, fontSize: 15, color: '#9ca3af' }}>Try adjusting your dates or filters</p>
            <button onClick={() => navigate('/hotels')}
              style={{ marginTop: 28, padding: '12px 32px', background: NAVY, color: '#fff', border: 'none', borderRadius: 10, fontFamily: F, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
              Browse All Hotels
            </button>
          </div>
        ) : (
          <>
            <p style={{ fontFamily: F, fontSize: 14, color: '#6b7280', fontWeight: 500, marginBottom: 28 }}>
              <span style={{ color: NAVY, fontWeight: 700 }}>{rooms.length}</span> rooms available
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
              {rooms.map(room => (
                <div key={room.id}
                  onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(12,31,58,0.14)'; }}
                  onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(12,31,58,0.08)'; }}
                  style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 16px rgba(12,31,58,0.08)', border: '1px solid #f0ece3', transition: 'all 0.3s' }}>
                  {/* Room image */}
                  <div style={{ position: 'relative', height: 210, overflow: 'hidden' }}>
                    <img src={room.imageUrl || ROOM_FALLBACK} alt={room.roomType}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                      onError={e => { e.target.src = ROOM_FALLBACK; }}
                      onMouseOver={e => e.target.style.transform = 'scale(1.06)'}
                      onMouseOut={e => e.target.style.transform = 'scale(1)'}/>
                    <div style={{ position: 'absolute', top: 12, left: 12, background: NAVY, color: GOLD2, borderRadius: 6, padding: '4px 10px', fontFamily: F, fontSize: 11, fontWeight: 700, letterSpacing: '0.5px' }}>
                      {room.roomType}
                    </div>
                    {room.averageRating && (
                      <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(255,255,255,0.95)', borderRadius: 6, padding: '4px 9px', fontFamily: F, fontSize: 12, fontWeight: 700, color: '#b45309', display: 'flex', alignItems: 'center', gap: 4 }}>
                        ★ {room.averageRating.toFixed(1)}
                      </div>
                    )}
                  </div>

                  {/* Room details */}
                  <div style={{ padding: '20px 22px 22px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <h3 style={{ fontFamily: F, fontSize: 17, fontWeight: 700, color: NAVY }}>Room {room.roomNumber}</h3>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontFamily: F, fontSize: 18, fontWeight: 800, color: NAVY }}>Rs.{room.currentPrice?.toLocaleString('en-IN')}</div>
                        <div style={{ fontFamily: F, fontSize: 11, color: '#9ca3af' }}>per night</div>
                      </div>
                    </div>
                    <p style={{ fontFamily: F, fontSize: 13, color: '#6b7280', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
                      <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      {room.hotelName}, {room.hotelCity}
                    </p>
                    <div style={{ display: 'flex', gap: 16, marginBottom: 14 }}>
                      <span style={{ fontFamily: F, fontSize: 12, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                        {room.capacity} guests
                      </span>
                      <span style={{ fontFamily: F, fontSize: 12, color: '#6b7280' }}>Floor {room.floorNumber || 1}</span>
                    </div>
                    {room.amenities?.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                        {room.amenities.slice(0, 3).map(a => (
                          <span key={a} style={{ fontFamily: F, fontSize: 11, background: '#f8f6f1', color: NAVY, padding: '3px 10px', borderRadius: 20, fontWeight: 500, border: '1px solid #e5e0d5' }}>{a}</span>
                        ))}
                      </div>
                    )}
                    <Link to={`/hotels/${room.hotelId}`}
                      style={{ display: 'block', textAlign: 'center', background: NAVY, color: '#fff', padding: '11px 0', borderRadius: 10, fontFamily: F, fontSize: 13, fontWeight: 700, textDecoration: 'none', transition: 'background 0.2s' }}
                      onMouseOver={e => e.target.style.background = '#1a3555'}
                      onMouseOut={e => e.target.style.background = NAVY}>
                      View Details &amp; Book
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: 48 }}>
                <button onClick={() => fetchRooms(filters.checkIn || today, filters.checkOut || tomorrow, page - 1)}
                  disabled={page === 0}
                  style={{ padding: '10px 20px', border: '1.5px solid #e5e0d5', borderRadius: 10, background: '#fff', fontFamily: F, fontSize: 13, fontWeight: 600, color: page === 0 ? '#d1d5db' : NAVY, cursor: page === 0 ? 'not-allowed' : 'pointer' }}>
                  Prev
                </button>
                <span style={{ fontFamily: F, fontSize: 14, color: '#6b7280', fontWeight: 500 }}>Page {page + 1} of {totalPages}</span>
                <button onClick={() => fetchRooms(filters.checkIn || today, filters.checkOut || tomorrow, page + 1)}
                  disabled={page >= totalPages - 1}
                  style={{ padding: '10px 20px', border: '1.5px solid #e5e0d5', borderRadius: 10, background: '#fff', fontFamily: F, fontSize: 13, fontWeight: 600, color: page >= totalPages - 1 ? '#d1d5db' : NAVY, cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer' }}>
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* spin keyframe for loading spinner */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
