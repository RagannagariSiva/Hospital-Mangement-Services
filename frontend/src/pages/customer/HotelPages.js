import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { hotelAPI, roomAPI } from '../../services/api';
import { toast } from 'react-toastify';

const NAVY  = '#0c1f3a';
const GOLD  = '#b8973a';
const GOLD2 = '#d4af5a';
const F     = "'Inter', system-ui, -apple-system, sans-serif";

/* ─── Curated fallback images ─── */
const HOTEL_IMAGES = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80',
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
];
const ROOM_IMAGES = [
  'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80',
  'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&q=80',
  'https://images.unsplash.com/photo-1560185007-5f0bb1866cab?w=600&q=80',
  'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&q=80',
  'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600&q=80',
  'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&q=80',
];

const getHotelImg = h => h.imageUrl || HOTEL_IMAGES[h.id % HOTEL_IMAGES.length] || HOTEL_IMAGES[0];
const getRoomImg  = (r, i) => r.imageUrl || ROOM_IMAGES[i % ROOM_IMAGES.length];

/* ─── Royal Grand Crown Logo SVG ─── */
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

/* ─── Standalone Royal Grand Navbar ─── */
function RGNavbar() {
  const [scrolled, setScrolled] = useState(false);
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
      transition: 'box-shadow 0.3s', fontFamily: F,
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
          <RGLogo size={40}/>
          <div>
            <div style={{ fontFamily: F, fontSize: 19, fontWeight: 800, color: NAVY, lineHeight: 1.1, letterSpacing: '-0.3px' }}>Royal Grand</div>
            <div style={{ fontFamily: F, fontSize: 9, letterSpacing: '2.8px', textTransform: 'uppercase', color: GOLD }}>Luxury Hotels</div>
          </div>
        </a>
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

/* ─── Star Rating ─── */
function Stars({ count = 0 }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1,2,3,4,5].map(n => (
        <svg key={n} width="13" height="13" viewBox="0 0 24 24" fill={n <= count ? '#f59e0b' : '#e5e7eb'} stroke={n <= count ? '#f59e0b' : '#e5e7eb'} strokeWidth="1">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </div>
  );
}

/* ─── Hotel Card ─── */
function HotelCard({ hotel, index }) {
  const img = getHotelImg(hotel);
  return (
    <Link to={`/hotels/${hotel.id}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1px solid #f0ece3', boxShadow: '0 2px 12px rgba(12,31,58,0.07)', transition: 'all 0.3s', color: 'inherit' }}
      onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(12,31,58,0.14)'; }}
      onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(12,31,58,0.07)'; }}>
      {/* Image */}
      <div style={{ position: 'relative', height: 210, overflow: 'hidden', background: '#f0ece3' }}>
        <img src={img} alt={hotel.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
          loading="lazy"
          onMouseOver={e => e.target.style.transform = 'scale(1.06)'}
          onMouseOut={e => e.target.style.transform = 'scale(1)'}
          onError={e => { e.target.src = HOTEL_IMAGES[index % HOTEL_IMAGES.length]; }}/>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(12,31,58,0.5) 0%, transparent 50%)' }}/>
        {/* Star rating bottom left */}
        <div style={{ position: 'absolute', bottom: 12, left: 14 }}><Stars count={hotel.starRating}/></div>
        {/* Guest rating top right */}
        {hotel.averageRating && (
          <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(255,255,255,0.95)', borderRadius: 8, padding: '4px 9px', fontFamily: F, fontSize: 12, fontWeight: 700, color: '#92400e', display: 'flex', alignItems: 'center', gap: 3 }}>
            ★ {hotel.averageRating.toFixed(1)}
          </div>
        )}
      </div>
      {/* Content */}
      <div style={{ padding: '18px 20px 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 style={{ fontFamily: F, fontSize: 16, fontWeight: 700, color: NAVY, marginBottom: 5, lineHeight: 1.3 }}>{hotel.name}</h3>
        <p style={{ fontFamily: F, fontSize: 13, color: '#6b7280', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 4 }}>
          <svg width="12" height="12" fill="none" stroke={GOLD} strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          {hotel.city}, {hotel.country}
        </p>
        {hotel.description && (
          <p style={{ fontFamily: F, fontSize: 13, color: '#9ca3af', lineHeight: 1.6, marginBottom: 12, flex: 1, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {hotel.description}
          </p>
        )}
        {hotel.amenities?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 14 }}>
            {[...hotel.amenities].slice(0, 3).map(a => (
              <span key={a} style={{ fontFamily: F, fontSize: 11, background: '#f8f6f1', color: NAVY, padding: '3px 9px', borderRadius: 20, fontWeight: 500, border: '1px solid #e5e0d5' }}>{a}</span>
            ))}
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid #f0ece3' }}>
          <span style={{ fontFamily: F, fontSize: 13, fontWeight: 600, color: hotel.availableRooms > 0 ? '#16a34a' : '#dc2626' }}>
            {hotel.availableRooms > 0 ? `${hotel.availableRooms} rooms free` : 'Fully booked'}
          </span>
          <span style={{ fontFamily: F, fontSize: 13, fontWeight: 700, color: GOLD, display: 'flex', alignItems: 'center', gap: 3 }}>
            View details
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ══════════════════════════════════════════
   HOTELS LIST PAGE
══════════════════════════════════════════ */
export function HotelsPage() {
  const [hotels, setHotels]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [page, setPage]         = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal]       = useState(0);
  const [search, setSearch]     = useState({ city: '', country: '' });
  const [applied, setApplied]   = useState({ city: '', country: '' });

  useEffect(() => {
    setLoading(true);
    const params = { page, size: 12 };
    const req = (applied.city || applied.country)
      ? hotelAPI.search({ ...params, ...applied })
      : hotelAPI.getAll(params);
    req.then(r => {
      const d = r.data.data;
      setHotels(d.content || []);
      setTotalPages(d.totalPages || 0);
      setTotal(d.totalElements || d.content?.length || 0);
    })
    .catch(() => toast.error('Failed to load hotels — check backend is running on port 8080'))
    .finally(() => setLoading(false));
  }, [page, applied]);

  const handleSearch = e => { e.preventDefault(); setApplied({ ...search }); setPage(0); };
  const clearSearch  = () => { setApplied({ city: '', country: '' }); setSearch({ city: '', country: '' }); setPage(0); };

  const inp = {
    border: 'none', outline: 'none', fontSize: 14, fontFamily: F,
    fontWeight: 500, color: NAVY, background: 'transparent', width: '100%',
  };
  const fieldLabel = {
    fontFamily: F, fontSize: 10, fontWeight: 700, letterSpacing: '2px',
    textTransform: 'uppercase', color: '#9ca3af', marginBottom: 5, display: 'block',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8f6f1', fontFamily: F }}>
      <RGNavbar/>
      <div style={{ paddingTop: 68 }}>

        {/* ── Hero Search Banner ── */}
        <div style={{ position: 'relative', background: NAVY, padding: '64px 7vw 52px', overflow: 'hidden' }}>
          {/* background image overlay */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1800&q=60)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.15 }}/>
          <div style={{ position: 'relative', zIndex: 1, maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
            <p style={{ fontFamily: F, fontSize: 11, fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: GOLD2, marginBottom: 14 }}>500+ Premium Properties</p>
            <h1 style={{ fontFamily: F, fontSize: 'clamp(28px,4vw,48px)', fontWeight: 900, color: '#fff', marginBottom: 10, letterSpacing: '-0.5px' }}>Discover Amazing Hotels</h1>
            <p style={{ fontFamily: F, fontSize: 15, color: 'rgba(255,255,255,0.6)', marginBottom: 36 }}>Luxury stays across India's most stunning destinations</p>

            {/* Search bar */}
            <form onSubmit={handleSearch}>
              <div style={{ background: '#fff', borderRadius: 14, overflow: 'hidden', display: 'flex', alignItems: 'stretch', maxWidth: 760, margin: '0 auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
                <div style={{ flex: 2, padding: '16px 22px', borderRight: '1px solid #e5e0d5' }}>
                  <label style={fieldLabel}>City / Destination</label>
                  <input style={inp} placeholder="Mumbai, Goa, Jaipur..." value={search.city}
                    onChange={e => setSearch({ ...search, city: e.target.value })}/>
                </div>
                <div style={{ flex: 1, padding: '16px 22px', borderRight: '1px solid #e5e0d5' }}>
                  <label style={fieldLabel}>Country</label>
                  <input style={inp} placeholder="India" value={search.country}
                    onChange={e => setSearch({ ...search, country: e.target.value })}/>
                </div>
                <button type="submit"
                  style={{ padding: '0 32px', background: GOLD, color: '#fff', border: 'none', fontFamily: F, fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* ── Results ── */}
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '44px 7vw' }}>
          {/* Applied filter banner */}
          {(applied.city || applied.country) && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28, background: '#fff', border: '1px solid #e5e0d5', borderRadius: 10, padding: '12px 18px' }}>
              <span style={{ fontFamily: F, fontSize: 14, color: '#6b7280' }}>
                <strong style={{ color: NAVY }}>{total}</strong> hotels found
                {applied.city && <> in <strong style={{ color: NAVY }}>"{applied.city}"</strong></>}
                {applied.country && <> ({applied.country})</>}
              </span>
              <button onClick={clearSearch}
                style={{ background: 'none', border: 'none', fontFamily: F, fontSize: 13, color: GOLD, fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}>
                Clear
              </button>
            </div>
          )}

          {loading ? (
            /* Skeleton cards */
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
              {[...Array(8)].map((_, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1px solid #f0ece3' }}>
                  <div style={{ height: 210, background: 'linear-gradient(90deg, #f0ece3 25%, #e5e0d5 50%, #f0ece3 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }}/>
                  <div style={{ padding: '18px 20px' }}>
                    {[80, 50, 100].map((w, j) => (
                      <div key={j} style={{ height: j === 0 ? 16 : 12, width: `${w}%`, background: '#f0ece3', borderRadius: 4, marginBottom: 10 }}/>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : hotels.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#f0ece3', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <svg width="36" height="36" fill="none" stroke={GOLD} strokeWidth="1.5" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              </div>
              <h3 style={{ fontFamily: F, fontSize: 22, fontWeight: 700, color: NAVY, marginBottom: 10 }}>No hotels found</h3>
              <p style={{ fontFamily: F, fontSize: 15, color: '#9ca3af', marginBottom: 28 }}>Try a different city or clear your search</p>
              <button onClick={clearSearch}
                style={{ padding: '12px 32px', background: NAVY, color: '#fff', border: 'none', borderRadius: 10, fontFamily: F, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                Show All Hotels
              </button>
            </div>
          ) : (
            <>
              {!applied.city && !applied.country && (
                <p style={{ fontFamily: F, fontSize: 14, color: '#6b7280', fontWeight: 500, marginBottom: 24 }}>
                  Showing <strong style={{ color: NAVY }}>{total}</strong> hotels
                </p>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
                {hotels.map((h, i) => <HotelCard key={h.id} hotel={h} index={i}/>)}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 48 }}>
                  <button onClick={() => setPage(p => p - 1)} disabled={page === 0}
                    style={{ padding: '10px 20px', border: '1.5px solid #e5e0d5', borderRadius: 10, background: '#fff', fontFamily: F, fontSize: 13, fontWeight: 600, color: page === 0 ? '#d1d5db' : NAVY, cursor: page === 0 ? 'not-allowed' : 'pointer' }}>
                    Prev
                  </button>
                  {[...Array(Math.min(totalPages, 5))].map((_, i) => (
                    <button key={i} onClick={() => setPage(i)}
                      style={{ width: 38, height: 38, borderRadius: 10, border: `1.5px solid ${i === page ? NAVY : '#e5e0d5'}`, background: i === page ? NAVY : '#fff', fontFamily: F, fontSize: 13, fontWeight: 700, color: i === page ? '#fff' : '#6b7280', cursor: 'pointer' }}>
                      {i + 1}
                    </button>
                  ))}
                  <button onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1}
                    style={{ padding: '10px 20px', border: '1.5px solid #e5e0d5', borderRadius: 10, background: '#fff', fontFamily: F, fontSize: 13, fontWeight: 600, color: page >= totalPages - 1 ? '#d1d5db' : NAVY, cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer' }}>
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
    </div>
  );
}

/* ══════════════════════════════════════════
   HOTEL DETAIL PAGE
══════════════════════════════════════════ */
export function HotelDetailPage() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel]   = useState(null);
  const [rooms, setRooms]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkIn,  setCheckIn]  = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [activeTab, setActiveTab] = useState('rooms');

  const today    = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  useEffect(() => {
    Promise.all([hotelAPI.getById(id), roomAPI.getByHotel(id, { page: 0, size: 20 })])
      .then(([h, r]) => {
        setHotel(h.data.data);
        setRooms(r.data.data?.content || []);
      })
      .catch(() => toast.error('Hotel not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBook = roomId => {
    const ci = checkIn  || today;
    const co = checkOut || tomorrow;
    navigate(`/book/${roomId}?checkIn=${ci}&checkOut=${co}`);
  };

  /* ── Loading skeleton ── */
  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#f8f6f1', fontFamily: F }}>
      <RGNavbar/>
      <div style={{ paddingTop: 68 }}>
        <div style={{ height: 360, background: 'linear-gradient(90deg, #e5e0d5 25%, #d4c9b8 50%, #e5e0d5 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }}/>
        <div style={{ maxWidth: 1100, margin: '40px auto', padding: '0 7vw', display: 'grid', gridTemplateColumns: '1fr 320px', gap: 32 }}>
          {[...Array(4)].map((_, i) => <div key={i} style={{ height: 180, background: '#e5e0d5', borderRadius: 16 }}/>)}
        </div>
      </div>
      <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
    </div>
  );

  if (!hotel) return (
    <div style={{ minHeight: '100vh', background: '#f8f6f1', display: 'flex', flexDirection: 'column', fontFamily: F }}>
      <RGNavbar/>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0' }}>
        <h2 style={{ fontFamily: F, fontSize: 24, fontWeight: 700, color: NAVY, marginBottom: 12 }}>Hotel not found</h2>
        <a href="/hotels" style={{ fontFamily: F, fontSize: 14, color: GOLD, fontWeight: 600 }}>Back to Hotels</a>
      </div>
    </div>
  );

  const heroImg = getHotelImg(hotel);
  const TABS = ['rooms', 'photos', 'reviews'];

  return (
    <div style={{ minHeight: '100vh', background: '#f8f6f1', fontFamily: F }}>
      <RGNavbar/>
      <div style={{ paddingTop: 68 }}>

        {/* ── Hero Image ── */}
        <div style={{ position: 'relative', height: 380, overflow: 'hidden', background: '#060f1e' }}>
          <img src={heroImg} alt={hotel.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
            onError={e => { e.target.src = HOTEL_IMAGES[0]; }}/>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(6,15,30,0.85) 0%, rgba(6,15,30,0.2) 55%, transparent 100%)' }}/>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '32px 7vw', maxWidth: 1100, margin: '0 auto' }}>
            <Stars count={hotel.starRating}/>
            <h1 style={{ fontFamily: F, fontSize: 'clamp(26px,4vw,44px)', fontWeight: 900, color: '#fff', marginTop: 8, marginBottom: 8, letterSpacing: '-0.5px' }}>{hotel.name}</h1>
            <p style={{ fontFamily: F, fontSize: 14, color: 'rgba(255,255,255,0.75)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="13" height="13" fill="none" stroke={GOLD2} strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              {hotel.address && `${hotel.address}, `}{hotel.city}, {hotel.country}
            </p>
          </div>
          {hotel.averageRating && (
            <div style={{ position: 'absolute', top: 24, right: '7vw', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 14, padding: '14px 20px', textAlign: 'center' }}>
              <div style={{ fontFamily: F, fontSize: 30, fontWeight: 900, color: '#fff' }}>{hotel.averageRating.toFixed(1)}</div>
              <div style={{ fontFamily: F, fontSize: 11, color: 'rgba(255,255,255,0.7)', letterSpacing: '1px', textTransform: 'uppercase' }}>Guest Score</div>
            </div>
          )}
        </div>

        {/* ── Main Content ── */}
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '36px 7vw', display: 'grid', gridTemplateColumns: '1fr 320px', gap: 32 }}>

          {/* Left column */}
          <div>
            {/* Quick stats */}
            <div style={{ background: '#fff', borderRadius: 16, padding: '24px', marginBottom: 24, border: '1px solid #f0ece3', boxShadow: '0 2px 12px rgba(12,31,58,0.06)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
                {[
                  { val: hotel.totalRooms, label: 'Total Rooms', bg: '#f0f4ff', color: '#1e40af' },
                  { val: hotel.availableRooms, label: 'Available', bg: '#f0fdf4', color: '#15803d' },
                  { val: `${hotel.starRating}★`, label: 'Star Rating', bg: '#fefce8', color: '#92400e' },
                  { val: hotel.averageRating?.toFixed(1) || 'New', label: 'Guest Score', bg: '#fdf4ff', color: '#7e22ce' },
                ].map(s => (
                  <div key={s.label} style={{ textAlign: 'center', padding: '14px 8px', background: s.bg, borderRadius: 12 }}>
                    <div style={{ fontFamily: F, fontSize: 22, fontWeight: 800, color: s.color }}>{s.val}</div>
                    <div style={{ fontFamily: F, fontSize: 11, color: s.color, fontWeight: 500, marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {hotel.description && (
                <p style={{ fontFamily: F, fontSize: 14, color: '#4b5563', lineHeight: 1.75, marginBottom: hotel.amenities?.length ? 20 : 0 }}>{hotel.description}</p>
              )}

              {hotel.amenities?.length > 0 && (
                <>
                  <h3 style={{ fontFamily: F, fontSize: 14, fontWeight: 700, color: NAVY, marginBottom: 12 }}>Amenities</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {[...hotel.amenities].map(a => (
                      <span key={a} style={{ fontFamily: F, fontSize: 13, background: '#f8f6f1', color: NAVY, padding: '6px 14px', borderRadius: 20, fontWeight: 500, border: '1px solid #e5e0d5' }}>{a}</span>
                    ))}
                  </div>
                </>
              )}

              {(hotel.phone || hotel.email) && (
                <div style={{ display: 'flex', gap: 20, marginTop: 20, paddingTop: 20, borderTop: '1px solid #f0ece3' }}>
                  {hotel.phone && <span style={{ fontFamily: F, fontSize: 13, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <svg width="13" height="13" fill="none" stroke={GOLD} strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.64 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.55 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.5a16 16 0 0 0 5.6 5.6l.87-.87a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 15.45"/></svg>
                    {hotel.phone}
                  </span>}
                  {hotel.email && <span style={{ fontFamily: F, fontSize: 13, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <svg width="13" height="13" fill="none" stroke={GOLD} strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    {hotel.email}
                  </span>}
                </div>
              )}
            </div>

            {/* Tabs */}
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f0ece3', boxShadow: '0 2px 12px rgba(12,31,58,0.06)', overflow: 'hidden' }}>
              <div style={{ display: 'flex', borderBottom: '1px solid #f0ece3' }}>
                {TABS.map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    style={{ flex: 1, padding: '16px 8px', fontFamily: F, fontSize: 13, fontWeight: 600, textTransform: 'capitalize', background: 'none', border: 'none', cursor: 'pointer', color: activeTab === tab ? GOLD : '#9ca3af', borderBottom: `2px solid ${activeTab === tab ? GOLD : 'transparent'}`, transition: 'all 0.2s' }}>
                    {tab} {tab === 'rooms' ? `(${rooms.length})` : ''}
                  </button>
                ))}
              </div>

              <div style={{ padding: 24 }}>
                {/* ROOMS */}
                {activeTab === 'rooms' && (
                  rooms.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '48px 0', color: '#9ca3af' }}>
                      <div style={{ fontSize: 48, marginBottom: 12 }}>🛏</div>
                      <p style={{ fontFamily: F, fontSize: 15 }}>No rooms available at this time</p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                      {rooms.map((room, ri) => (
                        <div key={room.id}
                          style={{ display: 'flex', gap: 16, padding: 16, border: '1px solid #f0ece3', borderRadius: 14, transition: 'all 0.2s' }}
                          onMouseOver={e => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.background = '#fffbf0'; }}
                          onMouseOut={e => { e.currentTarget.style.borderColor = '#f0ece3'; e.currentTarget.style.background = '#fff'; }}>
                          <div style={{ width: 140, height: 110, borderRadius: 10, overflow: 'hidden', flexShrink: 0, background: '#f0ece3' }}>
                            <img src={getRoomImg(room, ri)} alt={room.roomType}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              loading="lazy"
                              onError={e => { e.target.src = ROOM_IMAGES[ri % ROOM_IMAGES.length]; }}/>
                          </div>
                          <div style={{ flex: 1, display: 'flex', gap: 16 }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                                <span style={{ fontFamily: F, fontSize: 11, fontWeight: 700, background: '#f0f4ff', color: '#1e40af', padding: '3px 9px', borderRadius: 20 }}>{room.roomType}</span>
                                <span style={{ fontFamily: F, fontSize: 11, fontWeight: 600, background: room.status === 'AVAILABLE' ? '#f0fdf4' : '#fef2f2', color: room.status === 'AVAILABLE' ? '#15803d' : '#dc2626', padding: '3px 9px', borderRadius: 20 }}>{room.status}</span>
                              </div>
                              <h4 style={{ fontFamily: F, fontSize: 15, fontWeight: 700, color: NAVY, marginBottom: 4 }}>Room {room.roomNumber}</h4>
                              <p style={{ fontFamily: F, fontSize: 12, color: '#9ca3af', marginBottom: 8 }}>Floor {room.floorNumber || 1} · Up to {room.capacity} guests</p>
                              {room.amenities?.length > 0 && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                                  {[...room.amenities].slice(0, 4).map(a => (
                                    <span key={a} style={{ fontFamily: F, fontSize: 11, background: '#f8f6f1', color: '#4b5563', padding: '2px 8px', borderRadius: 6, border: '1px solid #e5e0d5' }}>{a}</span>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between', flexShrink: 0 }}>
                              <div style={{ textAlign: 'right' }}>
                                <div style={{ fontFamily: F, fontSize: 22, fontWeight: 900, color: NAVY }}>₹{room.currentPrice?.toLocaleString('en-IN')}</div>
                                <div style={{ fontFamily: F, fontSize: 11, color: '#9ca3af' }}>per night</div>
                              </div>
                              <button onClick={() => handleBook(room.id)}
                                disabled={room.status !== 'AVAILABLE'}
                                style={{ padding: '9px 22px', background: room.status === 'AVAILABLE' ? NAVY : '#e5e7eb', color: room.status === 'AVAILABLE' ? '#fff' : '#9ca3af', border: 'none', borderRadius: 10, fontFamily: F, fontSize: 13, fontWeight: 700, cursor: room.status === 'AVAILABLE' ? 'pointer' : 'not-allowed', transition: 'background 0.2s' }}>
                                {room.status === 'AVAILABLE' ? 'Book Now' : 'Unavailable'}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                )}

                {/* PHOTOS */}
                {activeTab === 'photos' && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                    {[heroImg, ...ROOM_IMAGES.slice(0, 5)].map((img, i) => (
                      <div key={i} style={{ aspectRatio: '16/10', borderRadius: 12, overflow: 'hidden', background: '#f0ece3' }}>
                        <img src={img} alt={`${hotel.name} ${i + 1}`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                          loading="lazy"
                          onMouseOver={e => e.target.style.transform = 'scale(1.07)'}
                          onMouseOut={e => e.target.style.transform = 'scale(1)'}
                          onError={e => { e.target.src = HOTEL_IMAGES[i % HOTEL_IMAGES.length]; }}/>
                      </div>
                    ))}
                  </div>
                )}

                {/* REVIEWS */}
                {activeTab === 'reviews' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {[
                      { name: 'Rahul S.', rating: 5, text: 'Absolutely stunning property. The rooms are immaculate and the staff is incredibly attentive.', date: '2 weeks ago' },
                      { name: 'Priya P.', rating: 4, text: 'Great location and beautiful rooms. The restaurant food was exceptional. Highly recommend!', date: '1 month ago' },
                      { name: 'Arjun M.', rating: 5, text: "Best hotel experience I've had in years. The spa was incredible and the views are breathtaking.", date: '1 month ago' },
                    ].map((r, i) => (
                      <div key={i} style={{ padding: 16, background: '#f8f6f1', borderRadius: 12, border: '1px solid #f0ece3' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 36, height: 36, borderRadius: '50%', background: `linear-gradient(135deg, ${NAVY}, ${GOLD})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F, fontSize: 13, fontWeight: 700, color: '#fff' }}>{r.name[0]}</div>
                            <span style={{ fontFamily: F, fontSize: 14, fontWeight: 600, color: NAVY }}>{r.name}</span>
                          </div>
                          <span style={{ fontFamily: F, fontSize: 12, color: '#9ca3af' }}>{r.date}</span>
                        </div>
                        <Stars count={r.rating}/>
                        <p style={{ fontFamily: F, fontSize: 13, color: '#4b5563', lineHeight: 1.7, marginTop: 8 }}>{r.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right — Booking widget */}
          <div>
            <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #f0ece3', boxShadow: '0 2px 12px rgba(12,31,58,0.06)', position: 'sticky', top: 84 }}>
              <h3 style={{ fontFamily: F, fontSize: 16, fontWeight: 800, color: NAVY, marginBottom: 20 }}>Check Availability</h3>

              <div style={{ marginBottom: 14 }}>
                <label style={{ fontFamily: F, fontSize: 10, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#9ca3af', display: 'block', marginBottom: 6 }}>Check-In</label>
                <input type="date" min={today} value={checkIn} onChange={e => setCheckIn(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px', border: '1.5px solid #e5e0d5', borderRadius: 10, fontFamily: F, fontSize: 14, color: NAVY, outline: 'none', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = GOLD}
                  onBlur={e => e.target.style.borderColor = '#e5e0d5'}/>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontFamily: F, fontSize: 10, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#9ca3af', display: 'block', marginBottom: 6 }}>Check-Out</label>
                <input type="date" min={checkIn || today} value={checkOut} onChange={e => setCheckOut(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px', border: '1.5px solid #e5e0d5', borderRadius: 10, fontFamily: F, fontSize: 14, color: NAVY, outline: 'none', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = GOLD}
                  onBlur={e => e.target.style.borderColor = '#e5e0d5'}/>
              </div>

              {/* Available rooms quick list */}
              {rooms.filter(r => r.status === 'AVAILABLE').slice(0, 3).map((room, ri) => (
                <div key={room.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: '#f8f6f1', borderRadius: 10, marginBottom: 10, border: '1px solid #f0ece3' }}>
                  <div>
                    <div style={{ fontFamily: F, fontSize: 13, fontWeight: 600, color: NAVY }}>{room.roomType}</div>
                    <div style={{ fontFamily: F, fontSize: 11, color: '#9ca3af' }}>{room.capacity} guests</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: F, fontSize: 14, fontWeight: 800, color: NAVY }}>₹{room.currentPrice?.toLocaleString('en-IN')}</div>
                    <button onClick={() => handleBook(room.id)}
                      style={{ marginTop: 4, padding: '4px 12px', background: GOLD, color: '#fff', border: 'none', borderRadius: 6, fontFamily: F, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                      Book
                    </button>
                  </div>
                </div>
              ))}

              <div style={{ marginTop: 16, padding: '12px 14px', background: '#f0fdf4', borderRadius: 10, textAlign: 'center', fontFamily: F, fontSize: 12, color: '#15803d', fontWeight: 600, border: '1px solid #bbf7d0' }}>
                Free cancellation · Best price guaranteed
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
    </div>
  );
}
