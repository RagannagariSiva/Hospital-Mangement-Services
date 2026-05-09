import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API  = 'http://localhost:8080/api';
const NAVY = '#0c1f3a';
const GOLD = '#b8973a';
const GOLD2 = '#d4af5a';
const F    = "'Inter', system-ui, -apple-system, sans-serif";

/* ── Royal Grand Crown Logo SVG ── */
function RGLogo({ size = 44 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill={NAVY}/>
      {/* Crown */}
      <path d="M8 27 L13 14 L19 22 L24 9 L29 22 L35 14 L40 27 L40 30 L8 30Z" fill={GOLD}/>
      {/* Crown gems */}
      <circle cx="8"  cy="27" r="2.5" fill={GOLD2}/>
      <circle cx="24" cy="9"  r="2.5" fill={GOLD2}/>
      <circle cx="40" cy="27" r="2.5" fill={GOLD2}/>
      {/* Hotel building */}
      <rect x="9" y="30" width="30" height="13" rx="1.5" fill="white" fillOpacity="0.93"/>
      {/* Arched entrance door */}
      <path d="M20 43 L20 36 Q24 31.5 28 36 L28 43Z" fill={NAVY}/>
      {/* Left window */}
      <rect x="11" y="32" width="6" height="4.5" rx="1" fill={GOLD} fillOpacity="0.85"/>
      {/* Right window */}
      <rect x="31" y="32" width="6" height="4.5" rx="1" fill={GOLD} fillOpacity="0.85"/>
    </svg>
  );
}

/* ── Navbar ── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);
  const lc = scrolled ? NAVY : 'rgba(255,255,255,0.96)';
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
      background: scrolled ? 'rgba(255,255,255,0.97)' : 'transparent',
      borderBottom: scrolled ? '1px solid #e5e0d5' : 'none',
      boxShadow: scrolled ? '0 2px 24px rgba(12,31,58,0.08)' : 'none',
      transition: 'all 0.4s',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px', height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
          <RGLogo size={42}/>
          <div>
            <div style={{ fontFamily: F, fontSize: 20, fontWeight: 800, color: lc, lineHeight: 1.1, letterSpacing: '-0.3px', transition: 'color 0.3s' }}>Royal Grand</div>
            <div style={{ fontFamily: F, fontSize: 9, letterSpacing: '2.8px', textTransform: 'uppercase', color: scrolled ? GOLD : 'rgba(212,175,90,0.9)', lineHeight: 1 }}>Luxury Hotels</div>
          </div>
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {[['Hotels', '/hotels'], ['Search', '/search']].map(([l, h]) => (
            <a key={l} href={h} style={{ padding: '8px 18px', fontFamily: F, fontSize: 14, fontWeight: 500, color: lc, textDecoration: 'none', transition: 'color 0.3s' }}>{l}</a>
          ))}
          {user ? (
            <>
              <a href={user.role === 'ADMIN' ? '/admin' : user.role === 'STAFF' ? '/staff' : '/bookings'}
                style={{ padding: '8px 18px', fontFamily: F, fontSize: 14, color: lc, textDecoration: 'none', fontWeight: 500 }}>{user.firstName}</a>
              <button onClick={() => { localStorage.clear(); window.location.reload(); }}
                style={{ padding: '9px 22px', border: `1.5px solid ${scrolled ? NAVY : 'rgba(255,255,255,0.75)'}`, borderRadius: 8, background: 'transparent', fontFamily: F, fontSize: 14, fontWeight: 600, color: scrolled ? NAVY : '#fff', cursor: 'pointer' }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <a href="/login"
                style={{ padding: '9px 22px', border: `1.5px solid ${scrolled ? NAVY : 'rgba(255,255,255,0.75)'}`, borderRadius: 8, fontFamily: F, fontSize: 14, fontWeight: 600, color: scrolled ? NAVY : '#fff', textDecoration: 'none' }}>
                Login
              </a>
              <a href="/register"
                style={{ padding: '9px 22px', background: GOLD, borderRadius: 8, fontFamily: F, fontSize: 14, fontWeight: 700, color: '#fff', textDecoration: 'none', marginLeft: 6 }}>
                Sign Up
              </a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

const SLIDES = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1800&q=85',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1800&q=85',
  'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1800&q=85',
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1800&q=85',
];

const DESTINATIONS = [
  { city: 'Mumbai', count: 48, img: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=700&q=80' },
  { city: 'Goa',    count: 35, img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=700&q=80' },
  { city: 'Jaipur', count: 29, img: 'https://images.unsplash.com/photo-1477587458883-47145ed8c786?auto=format&fit=crop&w=700&q=80' },
  { city: 'Delhi',  count: 62, img: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=700&q=80' },
  { city: 'Shimla', count: 18, img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=700&q=80' },
  { city: 'Jodhpur',count: 22, img: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=700&q=80' },
];

const ROOMS = [
  { type: 'Standard Room',      from: '3,500',  img: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=600&q=80', desc: 'Comfortable and well-appointed with all modern essentials.' },
  { type: 'Deluxe Room',        from: '6,500',  img: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=600&q=80', desc: 'Spacious rooms with premium furnishings and stunning views.' },
  { type: 'Luxury Suite',       from: '18,000', img: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=600&q=80', desc: 'Opulent suite with separate living area and butler service.' },
  { type: 'Presidential Suite', from: '55,000', img: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=600&q=80', desc: 'The pinnacle of luxury with panoramic views and private pool.' },
];

const SectionHead = ({ tag, title, sub }) => (
  <div style={{ textAlign: 'center', marginBottom: 52 }}>
    <p style={{ fontFamily: F, fontSize: 11, fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: GOLD, marginBottom: 14 }}>{tag}</p>
    <h2 style={{ fontFamily: F, fontSize: 'clamp(28px,3.5vw,42px)', fontWeight: 800, color: NAVY, marginBottom: sub ? 14 : 0, letterSpacing: '-0.5px' }}>{title}</h2>
    {sub && <p style={{ fontFamily: F, fontSize: 16, color: '#6b7280', fontStyle: 'italic' }}>{sub}</p>}
  </div>
);

export default function HomePage() {
  const navigate = useNavigate();
  const [slide,  setSlide]  = useState(0);
  const [search, setSearch] = useState({ location: '', checkIn: '', checkOut: '' });
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    const t = setInterval(() => setSlide(i => (i + 1) % SLIDES.length), 5500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    fetch(`${API}/hotels?page=0&size=3`).then(r => r.json()).then(d => setHotels(d.data?.content || [])).catch(() => {});
  }, []);

  return (
    <div style={{ fontFamily: F, color: NAVY, background: '#fff', overflowX: 'hidden' }}>
      <Navbar/>

      {/* HERO */}
      <section style={{ position: 'relative', height: '100vh', minHeight: 660, overflow: 'hidden' }}>
        {SLIDES.map((src, i) => (
          <div key={i} style={{ position: 'absolute', inset: 0, backgroundImage: `url(${src})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: i === slide ? 1 : 0, transition: 'opacity 1.4s ease' }}/>
        ))}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg,rgba(12,31,58,0.85) 38%,rgba(12,31,58,0.28) 100%)' }}/>
        <div style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 7vw', maxWidth: 960 }}>
          <p style={{ fontFamily: F, fontSize: 12, fontWeight: 700, letterSpacing: '3.5px', textTransform: 'uppercase', color: GOLD2, marginBottom: 20 }}>Over 500 Premium Hotels Across India</p>
          <h1 style={{ fontFamily: F, fontSize: 'clamp(46px,6.5vw,82px)', fontWeight: 900, color: '#fff', lineHeight: 1.08, marginBottom: 22, letterSpacing: '-1px' }}>
            Your Perfect<br/><span style={{ color: GOLD2 }}>Getaway</span> Awaits
          </h1>
          <p style={{ fontFamily: F, fontSize: 18, color: 'rgba(255,255,255,0.82)', marginBottom: 46, maxWidth: 500, lineHeight: 1.78 }}>
            Discover handpicked luxury hotels, seamless booking, and unforgettable experiences — all in one place.
          </p>
          {/* Search Bar */}
          <div style={{ display: 'flex', alignItems: 'stretch', background: 'rgba(255,255,255,0.97)', borderRadius: 14, overflow: 'hidden', boxShadow: '0 28px 72px rgba(0,0,0,0.38)', maxWidth: 820 }}>
            <div style={{ flex: 2, padding: '16px 24px', borderRight: '1px solid #e5e0d5' }}>
              <div style={{ fontFamily: F, fontSize: 10, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#9ca3af', marginBottom: 6 }}>Destination</div>
              <input type="text" placeholder="Where are you going?" value={search.location}
                onChange={e => setSearch(p => ({ ...p, location: e.target.value }))}
                style={{ border: 'none', outline: 'none', fontSize: 14, fontWeight: 500, color: NAVY, background: 'transparent', width: '100%', fontFamily: F }}/>
            </div>
            <div style={{ flex: 1, padding: '16px 24px', borderRight: '1px solid #e5e0d5' }}>
              <div style={{ fontFamily: F, fontSize: 10, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#9ca3af', marginBottom: 6 }}>Check In</div>
              <input type="date" value={search.checkIn}
                onChange={e => setSearch(p => ({ ...p, checkIn: e.target.value }))}
                style={{ border: 'none', outline: 'none', fontSize: 14, color: NAVY, background: 'transparent', width: '100%', fontFamily: F }}/>
            </div>
            <div style={{ flex: 1, padding: '16px 24px', borderRight: '1px solid #e5e0d5' }}>
              <div style={{ fontFamily: F, fontSize: 10, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#9ca3af', marginBottom: 6 }}>Check Out</div>
              <input type="date" value={search.checkOut}
                onChange={e => setSearch(p => ({ ...p, checkOut: e.target.value }))}
                style={{ border: 'none', outline: 'none', fontSize: 14, color: NAVY, background: 'transparent', width: '100%', fontFamily: F }}/>
            </div>
            <button
              onClick={() => {
                const p = new URLSearchParams();
                if (search.location) p.set('city', search.location);
                if (search.checkIn) p.set('checkIn', search.checkIn);
                if (search.checkOut) p.set('checkOut', search.checkOut);
                navigate(`/hotels?${p}`);
              }}
              style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '0 30px', background: NAVY, color: '#fff', border: 'none', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: F, flexShrink: 0 }}>
              <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              Search
            </button>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: 32, left: '7vw', display: 'flex', gap: 8, zIndex: 3 }}>
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)}
              style={{ width: i === slide ? 28 : 8, height: 8, borderRadius: 4, border: 'none', cursor: 'pointer', padding: 0, background: i === slide ? GOLD2 : 'rgba(255,255,255,0.4)', transition: 'all 0.35s' }}/>
          ))}
        </div>
      </section>

      {/* STATS */}
      <div style={{ background: NAVY, padding: '38px 7vw', display: 'flex', justifyContent: 'center', gap: '8vw' }}>
        {[['500+', 'Premium Hotels'], ['50,000+', 'Happy Guests'], ['25+', 'Cities'], ['4.9 / 5', 'Guest Rating']].map(([n, l]) => (
          <div key={l} style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: F, fontSize: 36, fontWeight: 800, color: GOLD2, letterSpacing: '-0.5px' }}>{n}</div>
            <div style={{ fontFamily: F, fontSize: 11, color: 'rgba(255,255,255,0.6)', letterSpacing: '1.8px', textTransform: 'uppercase', marginTop: 5 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* DESTINATIONS */}
      <section style={{ padding: '88px 7vw' }}>
        <SectionHead tag="Explore" title="Popular Destinations" sub="Handpicked cities with India's most stunning hotels"/>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, maxWidth: 1240, margin: '0 auto' }}>
          {DESTINATIONS.map((d, i) => (
            <div key={d.city}
              onClick={() => navigate(`/hotels?city=${d.city}`)}
              style={{ gridRow: i === 0 ? 'span 2' : 'span 1', minHeight: i === 0 ? 560 : 272, backgroundImage: `url(${d.img})`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: 16, cursor: 'pointer', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', transition: 'transform 0.3s' }}
              onMouseOver={e => e.currentTarget.style.transform = 'scale(1.022)'}
              onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(12,31,58,0.8) 0%,transparent 55%)' }}/>
              <div style={{ position: 'relative', padding: '26px 22px' }}>
                <div style={{ fontFamily: F, fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.3px' }}>{d.city}</div>
                <div style={{ fontFamily: F, fontSize: 13, color: 'rgba(255,255,255,0.78)', marginTop: 4 }}>{d.count} hotels available</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ROOM TYPES */}
      <section style={{ padding: '88px 7vw', background: '#f8f6f1' }}>
        <SectionHead tag="Luxury" title="Featured Room Types" sub="Every room crafted for comfort, elegance, and unforgettable memories"/>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24, maxWidth: 1240, margin: '0 auto' }}>
          {ROOMS.map(r => (
            <div key={r.type}
              onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-7px)'; e.currentTarget.style.boxShadow = '0 18px 52px rgba(12,31,58,0.16)'; }}
              onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(12,31,58,0.08)'; }}
              style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 20px rgba(12,31,58,0.08)', border: '1px solid #f0ece3', transition: 'all 0.3s' }}>
              <div style={{ height: 195, backgroundImage: `url(${r.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}/>
              <div style={{ padding: '20px 20px 22px' }}>
                <h3 style={{ fontFamily: F, fontSize: 16, fontWeight: 700, color: NAVY, marginBottom: 8 }}>{r.type}</h3>
                <p style={{ fontFamily: F, fontSize: 13, color: '#6b7280', lineHeight: 1.6, marginBottom: 16 }}>{r.desc}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontFamily: F, fontSize: 16, fontWeight: 800, color: NAVY }}>From Rs.{r.from}</span>
                    <span style={{ fontFamily: F, fontSize: 11, color: '#9ca3af' }}>/night</span>
                  </div>
                  <button onClick={() => navigate('/hotels')}
                    style={{ padding: '7px 15px', background: NAVY, color: '#fff', border: 'none', borderRadius: 8, fontFamily: F, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED HOTELS */}
      {hotels.length > 0 && (
        <section style={{ padding: '88px 7vw' }}>
          <SectionHead tag="Handpicked" title="Featured Hotels"/>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 28, maxWidth: 1240, margin: '0 auto' }}>
            {hotels.map(h => (
              <div key={h.id}
                onClick={() => navigate(`/hotels/${h.id}`)}
                onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 16px 44px rgba(12,31,58,0.14)'; }}
                onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(12,31,58,0.08)'; }}
                style={{ borderRadius: 16, overflow: 'hidden', cursor: 'pointer', boxShadow: '0 4px 20px rgba(12,31,58,0.08)', border: '1px solid #f0ece3', transition: 'all 0.3s' }}>
                <div style={{ height: 230, backgroundImage: `url(${h.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                  <span style={{ position: 'absolute', top: 14, right: 14, background: 'rgba(12,31,58,0.7)', color: GOLD2, borderRadius: 6, padding: '4px 10px', fontFamily: F, fontSize: 13 }}>{'★'.repeat(h.starRating || 4)}</span>
                </div>
                <div style={{ padding: '20px 22px 24px' }}>
                  <h3 style={{ fontFamily: F, fontSize: 18, fontWeight: 700, color: NAVY, marginBottom: 5 }}>{h.name}</h3>
                  <p style={{ fontFamily: F, fontSize: 13, color: '#6b7280' }}>{h.city}, {h.country}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 44 }}>
            <a href="/hotels" style={{ display: 'inline-block', padding: '14px 38px', background: NAVY, color: '#fff', borderRadius: 10, fontFamily: F, fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>View All Hotels</a>
          </div>
        </section>
      )}

      {/* CTA */}
      <section style={{ position: 'relative', padding: '96px 7vw', textAlign: 'center', backgroundImage: 'url(https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=80)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(12,31,58,0.88)' }}/>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 620, margin: '0 auto' }}>
          <h2 style={{ fontFamily: F, fontSize: 'clamp(30px,4vw,48px)', fontWeight: 900, color: '#fff', marginBottom: 18, letterSpacing: '-0.5px' }}>Ready for Your Next Adventure?</h2>
          <p style={{ fontFamily: F, fontSize: 17, color: 'rgba(255,255,255,0.8)', marginBottom: 40 }}>Join thousands of travellers who book their perfect stay with Royal Grand</p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
            <a href="/hotels" style={{ padding: '15px 38px', background: GOLD, color: '#fff', borderRadius: 10, fontFamily: F, fontWeight: 700, fontSize: 16, textDecoration: 'none' }}>Browse Hotels</a>
            <a href="/register" style={{ padding: '15px 38px', border: '2px solid rgba(255,255,255,0.6)', color: '#fff', borderRadius: 10, fontFamily: F, fontWeight: 600, fontSize: 16, textDecoration: 'none' }}>Create Free Account</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#060f1e', padding: '54px 7vw 32px' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40, paddingBottom: 40, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ maxWidth: 260 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <RGLogo size={40}/>
                <div>
                  <div style={{ fontFamily: F, fontSize: 18, fontWeight: 800, color: '#fff' }}>Royal Grand</div>
                  <div style={{ fontFamily: F, fontSize: 9, letterSpacing: '2.5px', textTransform: 'uppercase', color: GOLD }}>Luxury Hotels</div>
                </div>
              </div>
              <p style={{ fontFamily: F, fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.75 }}>Luxury hotel bookings across India's finest properties.</p>
            </div>
            {[['Company', ['About Us', 'Careers', 'Press']], ['Support', ['Help Centre', 'Contact Us', 'Privacy Policy']], ['Hotels', ['List Your Property', 'Partner Program']]].map(([title, links]) => (
              <div key={title}>
                <h4 style={{ fontFamily: F, fontSize: 11, fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 18 }}>{title}</h4>
                {links.map(l => <div key={l} style={{ fontFamily: F, fontSize: 14, color: 'rgba(255,255,255,0.65)', marginBottom: 11, cursor: 'pointer' }}>{l}</div>)}
              </div>
            ))}
          </div>
          <p style={{ fontFamily: F, textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>© 2026 Royal Grand Hotels. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
