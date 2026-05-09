import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

function EyeIcon({ open }) {
  if (open) return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  );
}

const SLIDES = [
  { img: "/images/facade.jpg", title: "A Grand Welcome", sub: "Experience world-class hospitality" },
  { img: "/images/room-suite.jpg", title: "Luxury Suites", sub: "Where comfort meets elegance" },
  { img: "/images/pool-luxury.jpg", title: "Infinity Pool", sub: "Relax in stunning surroundings" },
  { img: "/images/dining.jpg", title: "Fine Dining", sub: "Culinary excellence at its finest" },
  { img: "/images/hotel-rooftop.jpg", title: "Rooftop Views", sub: "Breathtaking city panoramas" },
];

function ImageSlider() {
  const [slide, setSlide] = React.useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % SLIDES.length), 4500);
    return () => clearInterval(t);
  }, []);
  const S = SLIDES[slide];
  return (
    <div className="hidden lg:flex flex-1 relative overflow-hidden">
      {SLIDES.map((sl, i) => (
        <div key={i} style={{
          position:"absolute", inset:0,
          backgroundImage: "url(" + sl.img + ")",
          backgroundSize:"cover", backgroundPosition:"center",
          opacity: i === slide ? 1 : 0,
          transition:"opacity 1.2s ease",
        }} />
      ))}
      <div className="absolute inset-0" style={{background:"linear-gradient(to bottom,rgba(0,0,0,0.15),rgba(0,0,0,0.65))"}} />
      <div className="absolute top-8 left-8 text-white text-2xl font-black tracking-widest">HOTELPRO</div>
      <div className="absolute bottom-12 left-8 right-8">
        <h2 className="text-white text-4xl font-bold leading-tight">{S.title}</h2>
        <p className="text-white mt-2 text-base" style={{opacity:0.7}}>{S.sub}</p>
        <div className="flex gap-2 mt-6">
          {SLIDES.map((_,i) => (
            <button key={i} onClick={() => setSlide(i)} style={{
              width: i===slide?"32px":"8px", height:"3px", borderRadius:"2px",
              background: i===slide?"#fff":"rgba(255,255,255,0.3)",
              transition:"all 0.4s", border:"none", cursor:"pointer", padding:0
            }} />
          ))}
        </div>
        <p className="text-white text-xs mt-4 tracking-widest" style={{opacity:0.3}}>
          {String(slide+1).padStart(2,"0")} / {String(SLIDES.length).padStart(2,"0")}
        </p>
      </div>
    </div>
  );
}

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email:"", password:"" });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success("Welcome back, " + user.firstName + "!");
      if (user.role === "ADMIN") navigate("/admin");
      else if (user.role === "STAFF") navigate("/staff");
      else navigate("/hotels");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid email or password");
    } finally { setLoading(false); }
  };

  return (
    <div className="flex min-h-screen font-sans">
      <ImageSlider />
      <div className="flex-1 flex items-center justify-center bg-gray-50 px-6 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <div style={{width:56,height:56,borderRadius:16,background:"#2563eb",margin:"0 auto 16px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,boxShadow:"0 8px 24px rgba(37,99,235,0.3)"}}>
              🏨
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Sign in</h1>
            <p className="text-gray-500 mt-2 text-sm">Welcome back to HotelPro</p>
          </div>
          <div className="bg-white rounded-2xl p-8" style={{boxShadow:"0 4px 24px rgba(0,0,0,0.08)",border:"1px solid #f1f5f9"}}>
            <form onbmit={handleSubmit}>
              <div className="mb-5">
                <label className="label">Email Address</label>
                <input type="email" required value={form.email}
                  onChange={e => setForm({...form, email:e.target.value})}
                  placeholder="you@example.com" className="input-field" />
              </div>
              <div className="mb-6">
                <label className="label">Password</label>
                <div className="relative">
                  <input type={showPass?"text":"password"} required value={form.password}
                    onChange={e => setForm({...form, password:e.target.value})}
                    placeholder="Enter your password" className="input-field pr-12" />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    <EyeIcon open={showPass} />
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 text-base">
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
            <div className="mt-6 pt-6 text-center" style={{borderTop:"1px solid #f1f5f9"}}>
              <span className="text-gray-500 text-sm">New to HotelPro? </span>
              <Link to="/register" className="text-blue-600 font-semibold text-sm hover:text-blue-700">Create account</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({firstName:"",lastName:"",email:"",phone:"",password:"",confirmPassword:""});
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const strength = (p) => {
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  };
  const strengthLabel = ["","Weak","Fair","Good","Strong"];
  const strengthColor = ["","#ef4444","#f59e0b","#3b82f6","#22c55e"];
  const s = strength(form.password);
  const passMatch = form.confirmPassword && form.password === form.confirmPassword;
  const passMismatch = form.confirmPassword && form.password !== form.confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { toast.error("Passwords do not match"); return; }
    if (form.password.length < 8) { toast.error("Password must be at least 8 characters"); return; }
    setLoading(true);
    try {
      const user = await register({
        firstName:form.firstName, lastName:form.lastName,
        email:form.email, phone:form.phone, password:form.password,
      });
      toast.success("Welcome to HotelPro, " + user.firstName + "!");
      navigate("/hotels");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="flex min-h-screen font-sans">
      <ImageSlider />
      <div className="flex-1 flex items-center justify-center bg-gray-50 px-6 py-8 overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div style={{width:56,height:56,borderRadius:16,background:"#2563eb",margin:"0 auto 16px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,boxShadow:"0 8px 24px rgba(37,99,235,0.3)"}}>
              🏨
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Create account</h1>
            <p className="text-gray-500 mt-2 text-sm">Join HotelPro and start booking</p>
          </div>
          <div className="bg-white rounded-2xl p-8" style={{boxShow:"0 4px 24px rgba(0,0,0,0.08)",border:"1px solid #f1f5f9"}}>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="label">First Name</label>
                  <input type="text" required value={form.firstName}
                    onChange={e => setForm({...form,firstName:e.target.value})}
                    placeholder="John" className="input-field" />
                </div>
                <div>
                  <label className="label">Last Name</label>
                  <input type="text" required value={form.lastName}
                    onChange={e => setForm({...form,lastName:e.target.value})}
                    placeholder="Doe" className="input-field" />
                </div>
              </div>
              <div className="mb-4">
                <label className="label">Email Address</label>
                <input type="email" required value={form.email}
                  onChange={e => setForm({...form,email:e.target.value})}
                  placeholder="you@example.com" className="input-field" />
              </div>
              <div className="mb-4">
                <label className="label">Phone Number</label>
                <input type="tel" required value={form.phone}
                  onChange={e => setForm({...form,phone:e.target.value})}
                  placeholder="+91 98765 43210" className="input-field" />
              </div>
              <div className="mb-4">
                <label className="label">Password</label>
                <div className="relative">
                  <input type={showPass?"text":"password"} required value={form.password}
                    onChange={e => setForm({...form,password:e.target.value})}
                    placeholder="Minimum 8 characters" className="input-field pr-12" />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    <EyeIcon open={showPass} />
                  </button>
                </div>
                {form.password && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1,2,3,4].map(i => (
                        <div key={i} style={{height:3,flex:1,borderRadius:2,background:s>=i?strengthColor[s]:"#e2e8f0",transition:"background 0.3s"}} />
                      ))}
                    </div>
                    <p className="text-xs" style={{color:strengthColor[s]}}>{strengthLabel[s]}</p>
                  </div>
                )}
              </div>
              <div className="mb-6">
                <label className="label">Confirm Password</label>
                <div className="relative">
                  <input type={showConfirm?"text":"password"} required value={form.confirmPassword}
                    onChange={e => setForm({...form,confirmPassword:e.target.value})}
                    placeholder="Re-enter your password"
                    className={"input-field pr-12" + (passMismatch?" border-red-400":" ") + (passMatch?" border-green-400":"")} />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    <EyeIcon open={showConfirm} />
                  </button>
                </div>
                {passMismatch && <p className="text-red-500 text-xs mt-1">Passwords do not match</p>}
                {passMatch && <p className="text-green-500 text-xs mt-1">Passwords match</p>}
              </div>
              <button type="submit" disabled={loading || passMismatch} className="btn-primary w-full justify-center py-3 text-base">
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </form>
            <div className="mt-6 pt-6 text-center" style={{borderTop:"1px solid #f1f5f9"}}>
              <span className="text-gray-500 text-sm">Already have an account? </span>
              <Link to="/login" className="text-blue-600 font-semibold text-sm hover:text-blue-700">Sign in</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
