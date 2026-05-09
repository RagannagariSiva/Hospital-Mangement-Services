import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API  = 'http://localhost:8080/api';
const NAVY = '#0c1f3a';
const GOLD = '#b8973a';
const GOLD2 = '#d4af5a';
const F    = "'Inter', system-ui, -apple-system, sans-serif";

const SLIDES = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1800&q=85',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1800&q=85',
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1800&q=85',
];

const DEMO = [
  { label: 'Admin', email: 'admin@hotelpro.com', password: 'Admin@123' },
  { label: 'Staff', email: 'staff@hotelpro.com', password: 'Admin@123' },
  { label: 'Guest', email: 'ravi@gmail.com',      password: 'Admin@123' },
];

/* ── Royal Grand Crown Logo ── */
function RGLogo({ size = 48 }) {
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

/* ── OTP 6-box input ── */
function OtpInput({ value, onChange }) {
  const refs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];
  const digits = value.split('').concat(Array(6).fill('')).slice(0, 6);

  const handleKey = (i, e) => {
    if (e.key === 'Backspace') {
      const next = digits.map((d, idx) => idx === i ? '' : d).join('');
      onChange(next.slice(0, 6));
      if (i > 0) refs[i - 1].current.focus();
      return;
    }
    if (!/^\d$/.test(e.key)) return;
    const next = digits.map((d, idx) => idx === i ? e.key : d).join('');
    onChange(next.slice(0, 6));
    if (i < 5) refs[i + 1].current.focus();
  };

  return (
    <div style={{ display: 'flex', gap: 10, justifyContent: 'center', margin: '22px 0' }}>
      {digits.map((d, i) => (
        <input key={i} ref={refs[i]} type="text" inputMode="numeric" maxLength={1}
          value={d} onKeyDown={e => handleKey(i, e)} onChange={() => {}}
          style={{
            width: 48, height: 56, textAlign: 'center', fontSize: 22, fontWeight: 700,
            fontFamily: F, border: `2px solid ${d ? GOLD : '#d1d5db'}`,
            borderRadius: 10, color: NAVY, outline: 'none',
            background: d ? '#fffbf0' : '#fff', transition: 'border-color 0.2s',
          }}/>
      ))}
    </div>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const [slide, setSlide]         = useState(0);
  const [step, setStep]           = useState('form');   // 'form' | 'otp'
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);
  const [otp, setOtp]             = useState('');
  const [serverOtp, setServerOtp] = useState('');
  const [timer, setTimer]         = useState(60);
  const [userData, setUserData]   = useState(null);
  const timerRef = useRef(null);

  /* slideshow */
  useEffect(() => {
    const t = setInterval(() => setSlide(i => (i + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  /* OTP countdown */
  useEffect(() => {
    if (step !== 'otp') return;
    setTimer(60);
    timerRef.current = setInterval(() => setTimer(t => t > 1 ? t - 1 : 0), 1000);
    return () => clearInterval(timerRef.current);
  }, [step]);

  const handleLogin = async e => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res  = await fetch(`${API}/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Invalid credentials.');
      setUserData(data);
      const gen = String(Math.floor(100000 + Math.random() * 900000));
      setServerOtp(gen);
      alert(`[DEMO] Royal Grand Login OTP: ${gen}`);
      setStep('otp');
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handleVerify = e => {
    e.preventDefault(); setError('');
    if (otp.length !== 6) { setError('Enter all 6 digits.'); return; }
    if (otp !== serverOtp) { setError('Incorrect OTP. Please try again.'); return; }
    const token = userData?.data?.accessToken || userData?.accessToken || userData?.token || '';
    const user  = userData?.data || userData?.user || userData;
    localStorage.setItem('accessToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    const role = (user?.role || '').toUpperCase();
    if (role === 'ADMIN') navigate('/admin');
    else if (role === 'STAFF') navigate('/staff');
    else navigate('/');
  };

  const resendOtp = () => {
    const gen = String(Math.floor(100000 + Math.random() * 900000));
    setServerOtp(gen); setOtp('');
    alert(`[DEMO] New OTP: ${gen}`);
    setTimer(60); clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setTimer(t => t > 1 ? t - 1 : 0), 1000);
  };

  /* ── Shared styles ── */
  const inp = {
    width: '100%', padding: '13px 16px', border: '1.5px solid #d1d5db',
    borderRadius: 10, fontSize: 14, fontFamily: F, fontWeight: 500,
    color: NAVY, outline: 'none', background: '#fff', display: 'block',
    transition: 'border-color 0.2s',
  };
  const lbl = {
    display: 'block', fontFamily: F, fontSize: 11, fontWeight: 700,
    letterSpacing: '1.5px', textTransform: 'uppercase', color: '#9ca3af', marginBottom: 7,
  };

  /* ── Full-screen background ── */
  const BG = () => (
    <>
      {SLIDES.map((src, i) => (
        <div key={i} style={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: `url(${src})`, backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: i === slide ? 1 : 0, transition: 'opacity 1.4s ease',
        }}/>
      ))}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'rgba(12,31,58,0.80)' }}/>
    </>
  );

  /* ── White card in center ── */
  const Card = ({ children }) => (
    <div style={{
      position: 'relative', zIndex: 10,
      width: '100%', maxWidth: 460,
      background: '#ffffff', borderRadius: 20,
      padding: '44px 48px',
      boxShadow: '0 32px 88px rgba(0,0,0,0.55)',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 13, justifyContent: 'center', marginBottom: 30 }}>
        <RGLogo size={52}/>
        <div>
          <div style={{ fontFamily: F, fontSize: 24, fontWeight: 800, color: NAVY, lineHeight: 1.1, letterSpacing: '-0.3px' }}>Royal Grand</div>
          <div style={{ fontFamily: F, fontSize: 9, letterSpacing: '3px', textTransform: 'uppercase', color: GOLD, lineHeight: 1 }}>Luxury Hotels</div>
        </div>
      </div>
      {children}
    </div>
  );

  /* ── OTP step ── */
  if (step === 'otp') {
    return (
      <div style={{ minHeight: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', position: 'relative', overflow: 'hidden' }}>
        <BG/>
        <Card>
          <h2 style={{ fontFamily: F, fontSize: 24, fontWeight: 800, color: NAVY, textAlign: 'center', marginBottom: 8 }}>Verify Login</h2>
          <p style={{ fontFamily: F, fontSize: 13, color: '#6b7280', textAlign: 'center', marginBottom: 4 }}>Enter the OTP to verify your identity</p>
          <p style={{ fontFamily: F, fontSize: 14, color: NAVY, textAlign: 'center', fontWeight: 700, marginBottom: 20 }}>{email}</p>

          {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '10px 16px', marginBottom: 16, fontFamily: F, fontSize: 13, color: '#dc2626', textAlign: 'center' }}>{error}</div>}

          <form onSubmit={handleVerify}>
            <OtpInput value={otp} onChange={setOtp}/>
            <button type="submit" style={{ width: '100%', padding: 15, background: NAVY, color: '#fff', border: 'none', borderRadius: 12, fontFamily: F, fontSize: 15, fontWeight: 700, cursor: 'pointer', marginBottom: 16 }}>
              Verify &amp; Sign In
            </button>
            <p style={{ textAlign: 'center', fontFamily: F, fontSize: 13, color: '#6b7280' }}>
              {timer > 0
                ? <>Resend in <strong style={{ color: NAVY }}>{timer}s</strong></>
                : <button type="button" onClick={resendOtp} style={{ background: 'none', border: 'none', color: GOLD, fontFamily: F, fontSize: 13, fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}>Resend OTP</button>}
            </p>
          </form>
          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <button onClick={() => { setStep('form'); setError(''); }}
              style={{ background: 'none', border: 'none', fontFamily: F, fontSize: 13, color: '#9ca3af', cursor: 'pointer' }}>
              Back to login
            </button>
          </div>
        </Card>
      </div>
    );
  }

  /* ── Login form ── */
  return (
    <div style={{ minHeight: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', position: 'relative', overflow: 'hidden' }}>
      <BG/>
      <Card>
        <h2 style={{ fontFamily: F, fontSize: 26, fontWeight: 800, color: NAVY, textAlign: 'center', marginBottom: 6, letterSpacing: '-0.3px' }}>Welcome Back</h2>
        <p style={{ fontFamily: F, fontSize: 13, color: '#9ca3af', textAlign: 'center', marginBottom: 28 }}>Sign in to continue your luxury experience</p>

        {/* Quick demo buttons */}
        <p style={{ fontFamily: F, fontSize: 10, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#9ca3af', textAlign: 'center', marginBottom: 10 }}>Quick Login</p>
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {DEMO.map(d => (
            <button key={d.label}
              onClick={() => { setEmail(d.email); setPassword(d.password); }}
              style={{ flex: 1, padding: '9px 6px', border: '1.5px solid #e5e0d5', borderRadius: 9, background: '#fafaf8', fontFamily: F, fontSize: 12, fontWeight: 600, color: NAVY, cursor: 'pointer' }}>
              {d.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div style={{ flex: 1, height: 1, background: '#e5e0d5' }}/>
          <span style={{ fontFamily: F, fontSize: 11, color: '#9ca3af', fontWeight: 500 }}>OR</span>
          <div style={{ flex: 1, height: 1, background: '#e5e0d5' }}/>
        </div>

        {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '10px 16px', marginBottom: 20, fontFamily: F, fontSize: 13, color: '#dc2626' }}>{error}</div>}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 18 }}>
            <label style={lbl}>Email</label>
            <input style={inp} type="email" placeholder="your@email.com" value={email} required
              onChange={e => setEmail(e.target.value)}
              onFocus={e => e.target.style.borderColor = GOLD}
              onBlur={e => e.target.style.borderColor = '#d1d5db'}/>
          </div>
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
              <label style={{ ...lbl, marginBottom: 0 }}>Password</label>
              <a href="/forgot-password" style={{ fontFamily: F, fontSize: 12, color: GOLD, fontWeight: 600 }}>Forgot?</a>
            </div>
            <input style={inp} type="password" placeholder="Your password" value={password} required
              onChange={e => setPassword(e.target.value)}
              onFocus={e => e.target.style.borderColor = GOLD}
              onBlur={e => e.target.style.borderColor = '#d1d5db'}/>
          </div>
          <button type="submit" disabled={loading}
            style={{ width: '100%', padding: 15, background: loading ? '#9ca3af' : NAVY, color: '#fff', border: 'none', borderRadius: 12, fontFamily: F, fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', marginBottom: 20, transition: 'background 0.2s' }}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <p style={{ textAlign: 'center', fontFamily: F, fontSize: 14, color: '#6b7280' }}>
          New to Royal Grand?{' '}
          <a href="/register" style={{ color: GOLD, fontWeight: 700 }}>Create Account</a>
        </p>
      </Card>
    </div>
  );
}
