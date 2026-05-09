import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API   = 'http://localhost:8080/api';
const NAVY  = '#0c1f3a';
const GOLD  = '#b8973a';
const GOLD2 = '#d4af5a';
const F     = "'Inter', system-ui, -apple-system, sans-serif";

const SLIDES = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1600&q=80',
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

/* ── Password strength ── */
function passwordStrength(pw) {
  if (!pw) return { label: '', pct: 0, color: '#e5e7eb' };
  let s = 0;
  if (pw.length >= 8)           s++;
  if (/[A-Z]/.test(pw))         s++;
  if (/[0-9]/.test(pw))         s++;
  if (/[^A-Za-z0-9]/.test(pw))  s++;
  const map = [
    { label: 'Weak',   pct: 25,  color: '#ef4444' },
    { label: 'Fair',   pct: 50,  color: '#f97316' },
    { label: 'Good',   pct: 75,  color: '#eab308' },
    { label: 'Strong', pct: 100, color: '#22c55e' },
  ];
  return map[s - 1] || { label: 'Too short', pct: 10, color: '#ef4444' };
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
    <div style={{ display: 'flex', gap: 10, justifyContent: 'center', margin: '24px 0' }}>
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

export default function Register() {
  const navigate = useNavigate();
  const [slide, setSlide]       = useState(0);
  const [step, setStep]         = useState('form');  // 'form' | 'otp' | 'done'
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [form, setForm]         = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', confirm: '' });
  const [otp, setOtp]           = useState('');
  const [serverOtp, setServerOtp] = useState('');
  const [timer, setTimer]       = useState(60);
  const timerRef                = useRef(null);

  /* Slideshow */
  useEffect(() => {
    const t = setInterval(() => setSlide(i => (i + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  /* OTP countdown */
  useEffect(() => {
    if (step !== 'otp') return;
    setTimer(60);
    timerRef.current = setInterval(() => {
      setTimer(t => { if (t <= 1) { clearInterval(timerRef.current); return 0; } return t - 1; });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [step]);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const pw  = passwordStrength(form.password);

  const inp = {
    width: '100%', padding: '13px 16px', border: '1.5px solid #d1d5db',
    borderRadius: 10, fontSize: 14, fontFamily: F, fontWeight: 500,
    color: NAVY, outline: 'none', background: '#fff', transition: 'border-color 0.2s',
  };
  const lbl = {
    display: 'block', fontFamily: F, fontSize: 11, fontWeight: 700,
    letterSpacing: '1.5px', textTransform: 'uppercase', color: '#9ca3af', marginBottom: 7,
  };

  /* ── Full-screen background overlay ── */
  const BG = ({ dim = 0.80 }) => (
    <>
      {SLIDES.map((src, i) => (
        <div key={i} style={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: `url(${src})`, backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: i === slide ? 1 : 0, transition: 'opacity 1.4s ease',
        }}/>
      ))}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: `rgba(12,31,58,${dim})` }}/>
    </>
  );

  /* ── Logo header inside card ── */
  const LogoHeader = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 13, justifyContent: 'center', marginBottom: 28 }}>
      <RGLogo size={52}/>
      <div>
        <div style={{ fontFamily: F, fontSize: 24, fontWeight: 800, color: NAVY, lineHeight: 1.1, letterSpacing: '-0.3px' }}>Royal Grand</div>
        <div style={{ fontFamily: F, fontSize: 9, letterSpacing: '3px', textTransform: 'uppercase', color: GOLD }}>Luxury Hotels</div>
      </div>
    </div>
  );

  /* ── DONE screen ── */
  if (step === 'done') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', padding: '40px 20px' }}>
        <BG dim={0.85}/>
        <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 460, background: '#fff', borderRadius: 20, padding: '52px 48px', boxShadow: '0 32px 88px rgba(0,0,0,0.55)', textAlign: 'center' }}>
          <LogoHeader/>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h2 style={{ fontFamily: F, fontSize: 26, fontWeight: 800, color: NAVY, marginBottom: 12 }}>Welcome to Royal Grand</h2>
          <p style={{ fontFamily: F, fontSize: 15, color: '#6b7280', lineHeight: 1.7, marginBottom: 8 }}>Your account has been verified and created successfully.</p>
          <p style={{ fontFamily: F, fontSize: 13, color: GOLD, fontWeight: 600 }}>Redirecting to login...</p>
        </div>
      </div>
    );
  }

  /* ── OTP screen ── */
  if (step === 'otp') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', padding: '40px 20px' }}>
        <BG dim={0.82}/>
        <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 460, background: '#fff', borderRadius: 20, padding: '44px 48px', boxShadow: '0 32px 88px rgba(0,0,0,0.55)' }}>
          <LogoHeader/>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#fffbf0', border: `2px solid ${GOLD}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.64 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.55 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.5a16 16 0 0 0 5.6 5.6l.87-.87a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 15.45"/>
              </svg>
            </div>
            <h2 style={{ fontFamily: F, fontSize: 22, fontWeight: 800, color: NAVY, marginBottom: 10 }}>Verify Your Number</h2>
            <p style={{ fontFamily: F, fontSize: 14, color: '#6b7280', lineHeight: 1.65 }}>
              We sent a 6-digit OTP to<br/>
              <strong style={{ color: NAVY }}>{form.phone}</strong>
            </p>
          </div>

          {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '11px 16px', marginBottom: 20, fontFamily: F, fontSize: 13, color: '#dc2626', textAlign: 'center' }}>{error}</div>}

          <form onSubmit={e => {
            e.preventDefault(); setError('');
            if (otp.length !== 6) { setError('Enter the 6-digit OTP.'); return; }
            if (otp !== serverOtp) { setError('Incorrect OTP. Please try again.'); return; }
            setStep('done');
            setTimeout(() => navigate('/login'), 3000);
          }}>
            <OtpInput value={otp} onChange={setOtp}/>
            <button type="submit" style={{ width: '100%', padding: 15, background: NAVY, color: '#fff', border: 'none', borderRadius: 12, fontFamily: F, fontSize: 15, fontWeight: 700, cursor: 'pointer', marginBottom: 18 }}>
              Verify OTP
            </button>
            <div style={{ textAlign: 'center', fontFamily: F, fontSize: 13, color: '#6b7280' }}>
              {timer > 0
                ? <span>Resend OTP in <strong style={{ color: NAVY }}>{timer}s</strong></span>
                : <button type="button" onClick={() => {
                    const gen = String(Math.floor(100000 + Math.random() * 900000));
                    setServerOtp(gen); setOtp('');
                    alert(`[DEMO] New OTP: ${gen}`);
                    setTimer(60); clearInterval(timerRef.current);
                    timerRef.current = setInterval(() => setTimer(t => t > 1 ? t - 1 : 0), 1000);
                  }} style={{ background: 'none', border: 'none', color: GOLD, fontFamily: F, fontSize: 13, fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}>
                    Resend OTP
                  </button>}
            </div>
          </form>
          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <button onClick={() => { setStep('form'); setError(''); }}
              style={{ background: 'none', border: 'none', fontFamily: F, fontSize: 13, color: '#9ca3af', cursor: 'pointer' }}>
              Back to registration
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── REGISTRATION FORM ── */
  const handleRegister = async e => {
    e.preventDefault(); setError('');
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (!/^\+?\d{10,13}$/.test(form.phone.replace(/\s/g, ''))) { setError('Enter a valid phone number (10–13 digits).'); return; }
    setLoading(true);
    try {
      const res  = await fetch(`${API}/auth/register`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName: form.firstName, lastName: form.lastName, email: form.email, phone: form.phone, password: form.password, role: 'CUSTOMER' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed.');
      const gen = String(Math.floor(100000 + Math.random() * 900000));
      setServerOtp(gen);
      alert(`[DEMO] Your Royal Grand OTP is: ${gen}\n\nIn production this would be sent via SMS.`);
      setStep('otp');
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', padding: '40px 20px' }}>
      {/* Background slides */}
      <BG dim={0.75}/>

      {/* Scrollable form card - always on top */}
      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 500 }}>
        <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 32px 88px rgba(0,0,0,0.55)', padding: '44px 48px' }}>
          <LogoHeader/>

          <h2 style={{ fontFamily: F, fontSize: 22, fontWeight: 800, color: NAVY, textAlign: 'center', marginBottom: 6, letterSpacing: '-0.3px' }}>Create Your Account</h2>
          <p style={{ fontFamily: F, fontSize: 13, color: '#9ca3af', textAlign: 'center', marginBottom: 30 }}>Join Royal Grand and start your luxury journey</p>

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '11px 16px', marginBottom: 22, fontFamily: F, fontSize: 13, color: '#dc2626' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleRegister}>
            {/* Name row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 18 }}>
              <div>
                <label style={lbl}>First Name</label>
                <input style={inp} type="text" placeholder="Ravi" value={form.firstName} required
                  onChange={e => set('firstName', e.target.value)}
                  onFocus={e => e.target.style.borderColor = GOLD}
                  onBlur={e => e.target.style.borderColor = '#d1d5db'}/>
              </div>
              <div>
                <label style={lbl}>Last Name</label>
                <input style={inp} type="text" placeholder="Kumar" value={form.lastName} required
                  onChange={e => set('lastName', e.target.value)}
                  onFocus={e => e.target.style.borderColor = GOLD}
                  onBlur={e => e.target.style.borderColor = '#d1d5db'}/>
              </div>
            </div>

            {/* Email */}
            <div style={{ marginBottom: 18 }}>
              <label style={lbl}>Email Address</label>
              <input style={inp} type="email" placeholder="ravi@gmail.com" value={form.email} required
                onChange={e => set('email', e.target.value)}
                onFocus={e => e.target.style.borderColor = GOLD}
                onBlur={e => e.target.style.borderColor = '#d1d5db'}/>
            </div>

            {/* Phone */}
            <div style={{ marginBottom: 18 }}>
              <label style={lbl}>Phone Number</label>
              <input style={inp} type="tel" placeholder="+91 9876543210" value={form.phone} required
                onChange={e => set('phone', e.target.value)}
                onFocus={e => e.target.style.borderColor = GOLD}
                onBlur={e => e.target.style.borderColor = '#d1d5db'}/>
              <p style={{ fontFamily: F, fontSize: 11, color: '#9ca3af', marginTop: 5 }}>OTP will be sent to this number</p>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 18 }}>
              <label style={lbl}>Password</label>
              <input style={inp} type="password" placeholder="Min. 8 characters" value={form.password} required
                onChange={e => set('password', e.target.value)}
                onFocus={e => e.target.style.borderColor = GOLD}
                onBlur={e => e.target.style.borderColor = '#d1d5db'}/>
              {form.password && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ height: 4, background: '#e5e7eb', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pw.pct}%`, background: pw.color, transition: 'width 0.4s', borderRadius: 2 }}/>
                  </div>
                  <p style={{ fontFamily: F, fontSize: 11, color: pw.color, marginTop: 4, fontWeight: 600 }}>{pw.label}</p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: 28 }}>
              <label style={lbl}>Confirm Password</label>
              <input
                style={{ ...inp, borderColor: form.confirm && form.password !== form.confirm ? '#ef4444' : '#d1d5db' }}
                type="password" placeholder="Re-enter password" value={form.confirm} required
                onChange={e => set('confirm', e.target.value)}
                onFocus={e => e.target.style.borderColor = form.confirm && form.password !== form.confirm ? '#ef4444' : GOLD}
                onBlur={e => e.target.style.borderColor = form.confirm && form.password !== form.confirm ? '#ef4444' : '#d1d5db'}/>
              {form.confirm && form.password !== form.confirm && (
                <p style={{ fontFamily: F, fontSize: 11, color: '#ef4444', marginTop: 4 }}>Passwords do not match</p>
              )}
            </div>

            <button type="submit" disabled={loading}
              style={{ width: '100%', padding: 15, background: loading ? '#9ca3af' : NAVY, color: '#fff', border: 'none', borderRadius: 12, fontFamily: F, fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s', marginBottom: 20 }}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontFamily: F, fontSize: 14, color: '#6b7280' }}>
            Already have an account?{' '}
            <a href="/login" style={{ color: GOLD, fontWeight: 700 }}>Sign In</a>
          </p>
        </div>
        <p style={{ textAlign: 'center', fontFamily: F, fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 18 }}>
          © 2026 Royal Grand Hotels. All rights reserved.
        </p>
      </div>
    </div>
  );
}
