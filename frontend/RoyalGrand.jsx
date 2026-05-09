import { useState, useRef, useEffect, useCallback } from "react";

/* ─── Google Fonts ─────────────────────────────────── */
const FontLink = () => (
  <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap');`}</style>
);

/* ─── Design Tokens ────────────────────────────────── */
const T = {
  navy:    "#0B1622",
  navyMid: "#122035",
  navyLight:"#1A2D47",
  gold:    "#C9A84C",
  goldLight:"#E6C97B",
  goldPale:"#F5E9C8",
  cream:   "#FAF6EE",
  white:   "#FFFFFF",
  gray50:  "#F8F7F4",
  gray100: "#EDE9DF",
  gray300: "#BDB8AE",
  gray500: "#8A8680",
  gray700: "#4A4740",
  red:     "#C0392B",
  green:   "#1A6B3C",
};

const css = {
  root: {
    fontFamily: "'Jost', sans-serif",
    background: T.cream,
    minHeight: "100vh",
    color: T.navy,
    overflowX: "hidden",
  },
  /* Navbar */
  nav: {
    position: "sticky", top: 0, zIndex: 100,
    background: T.navy,
    padding: "0 2rem",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    height: 72,
    borderBottom: `1px solid rgba(201,168,76,0.25)`,
    boxShadow: "0 2px 20px rgba(0,0,0,0.35)",
  },
  navBrand: {
    display: "flex", alignItems: "center", gap: 12, cursor: "pointer",
    textDecoration: "none",
  },
  navLogoImg: {
    width: 40, height: 40, borderRadius: "50%",
    border: `2px solid ${T.gold}`,
    objectFit: "cover",
  },
  navBrandText: {
    display: "flex", flexDirection: "column", lineHeight: 1.1,
  },
  navTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 18, fontWeight: 700,
    color: T.gold, letterSpacing: 1,
  },
  navSub: {
    fontSize: 10, color: T.gray300, letterSpacing: 3, textTransform: "uppercase",
    fontWeight: 300,
  },
  navLinks: {
    display: "flex", alignItems: "center", gap: "2rem",
  },
  navLink: {
    color: T.gray300, fontSize: 13, letterSpacing: 1.5,
    textTransform: "uppercase", fontWeight: 500,
    cursor: "pointer", transition: "color 0.2s",
    textDecoration: "none", border: "none", background: "none",
    padding: "4px 0",
  },
  btnGold: {
    background: `linear-gradient(135deg, ${T.gold}, ${T.goldLight})`,
    color: T.navy, border: "none", borderRadius: 2,
    padding: "10px 24px", fontSize: 12, fontWeight: 700,
    letterSpacing: 1.5, textTransform: "uppercase", cursor: "pointer",
    transition: "opacity 0.2s, transform 0.15s",
    fontFamily: "'Jost', sans-serif",
  },
  btnOutlineGold: {
    background: "transparent",
    color: T.gold, border: `1px solid ${T.gold}`, borderRadius: 2,
    padding: "10px 24px", fontSize: 12, fontWeight: 600,
    letterSpacing: 1.5, textTransform: "uppercase", cursor: "pointer",
    transition: "all 0.2s",
    fontFamily: "'Jost', sans-serif",
  },
  btnNavy: {
    background: T.navy,
    color: T.gold, border: `1px solid ${T.gold}`, borderRadius: 2,
    padding: "12px 32px", fontSize: 12, fontWeight: 700,
    letterSpacing: 1.5, textTransform: "uppercase", cursor: "pointer",
    fontFamily: "'Jost', sans-serif",
  },
  /* Section */
  section: (bg = T.cream) => ({
    background: bg, padding: "80px 0",
  }),
  sectionInner: {
    maxWidth: 1200, margin: "0 auto", padding: "0 2rem",
  },
  sectionLabel: {
    fontSize: 11, letterSpacing: 4, textTransform: "uppercase",
    color: T.gold, fontWeight: 600, marginBottom: 12,
    display: "block",
  },
  sectionTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 40, fontWeight: 700, color: T.navy,
    marginBottom: 16, lineHeight: 1.2,
  },
  sectionTitleWhite: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 40, fontWeight: 700, color: T.white,
    marginBottom: 16, lineHeight: 1.2,
  },
  sectionDesc: {
    color: T.gray500, fontSize: 16, lineHeight: 1.7,
    maxWidth: 520, marginBottom: 0,
    fontFamily: "'Cormorant Garamond', serif",
  },
  dividerGold: {
    width: 60, height: 2,
    background: `linear-gradient(90deg, ${T.gold}, ${T.goldLight})`,
    margin: "16px 0 32px",
    border: "none",
  },
};

/* ─── Data ─────────────────────────────────────────── */
const DESTINATIONS = [
  { city: "Mumbai", count: 48, img: "https://images.unsplash.com/photo-1562979314-bee7453e911c?w=600&q=80" },
  { city: "Goa",    count: 35, img: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&q=80" },
  { city: "Jaipur", count: 29, img: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&q=80" },
  { city: "Jodhpur",count: 22, img: "https://images.unsplash.com/photo-1477587458883-47145ed4a929?w=600&q=80" },
  { city: "Delhi",  count: 62, img: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&q=80" },
  { city: "Shimla", count: 18, img: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&q=80" },
];

const ROOM_TYPES = [
  { name: "Deluxe Room",       price: 4050,  img: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80", tag: "Most Popular", beds: "King Bed", sqft: 420 },
  { name: "Premium Suite",     price: 8200,  img: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&q=80", tag: "Best Value",   beds: "King Bed", sqft: 680 },
  { name: "Royal Suite",       price: 14500, img: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&q=80", tag: "Signature",    beds: "2 King Beds", sqft: 1100 },
  { name: "Presidential Suite",price: 28000, img: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&q=80", tag: "Exclusive",    beds: "2 King Beds", sqft: 2200 },
];

const HOTELS = [
  { id: 1,  name: "Royal Grand Mumbai", city: "Mumbai", stars: 5, rating: 4.9, reviews: 1284, price: 8500,  img: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&q=80", tag: "Seafront View",   amenities: ["Pool","Spa","Gym","Restaurant","Bar"] },
  { id: 2,  name: "Royal Grand Goa Beach",   city: "Goa",    stars: 5, rating: 4.8, reviews: 987,  price: 6200,  img: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80", tag: "Beachfront",      amenities: ["Beach","Pool","Spa","Restaurant"] },
  { id: 3,  name: "Royal Grand Jaipur Palace",city:"Jaipur", stars: 5, rating: 4.9, reviews: 756,  price: 9800,  img: "https://images.unsplash.com/photo-1529290130-4ca3753253ae?w=600&q=80", tag: "Heritage Palace", amenities: ["Pool","Spa","Gym","Restaurant","Bar"] },
  { id: 4,  name: "Royal Grand Delhi",  city: "Delhi",  stars: 5, rating: 4.7, reviews: 2103, price: 7400,  img: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80", tag: "City Centre",     amenities: ["Pool","Spa","Gym","Restaurant","Bar","Lounge"] },
  { id: 5,  name: "Royal Grand Shimla Heights", city:"Shimla",stars:4,rating:4.6,reviews:432,price:4200, img:"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80", tag: "Mountain Retreat", amenities:["Spa","Restaurant","Bar","Fireplace"] },
  { id: 6,  name: "Royal Grand Jodhpur Fort",city:"Jodhpur",stars:5,rating:4.8,reviews:619,price:11200,img:"https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?w=600&q=80",tag:"Fort Views",amenities:["Pool","Spa","Restaurant","Cultural Events"] },
];

const GALLERY = [
  "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=700&q=80",
  "https://images.unsplash.com/photo-1600011689032-8b628b8a8747?w=700&q=80",
  "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=700&q=80",
  "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=700&q=80",
];

/* ─── Notification Banner ──────────────────────────── */
function Notification({ msg, type, onClose }) {
  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(onClose, 6000);
    return () => clearTimeout(t);
  }, [msg]);
  if (!msg) return null;
  const bg = type === "success" ? "#1A6B3C" : type === "error" ? T.red : T.navyMid;
  return (
    <div style={{
      position: "fixed", top: 80, right: 24, zIndex: 9999,
      background: bg, color: T.white,
      padding: "14px 24px", borderRadius: 4,
      fontSize: 14, fontWeight: 500, letterSpacing: 0.5,
      display: "flex", alignItems: "center", gap: 12,
      boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
      animation: "slideIn 0.3s ease",
      maxWidth: 360,
    }}>
      <span style={{ fontSize: 18 }}>
        {type === "success" ? "✓" : type === "error" ? "✕" : "ℹ"}
      </span>
      {msg}
      <button onClick={onClose} style={{
        marginLeft: 8, background: "none", border: "none",
        color: "rgba(255,255,255,0.7)", cursor: "pointer", fontSize: 18, lineHeight: 1
      }}>×</button>
    </div>
  );
}

/* ─── OTP Input ────────────────────────────────────── */
function OTPInput({ length = 6, value, onChange }) {
  const refs = useRef([]);

  const handleChange = (i, e) => {
    const ch = e.target.value.replace(/\D/g, "").slice(-1);
    const arr = value.split("");
    arr[i] = ch;
    onChange(arr.join(""));
    if (ch && i < length - 1) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace") {
      if (!value[i] && i > 0) {
        refs.current[i - 1]?.focus();
        const arr = value.split("");
        arr[i - 1] = "";
        onChange(arr.join(""));
      } else {
        const arr = value.split("");
        arr[i] = "";
        onChange(arr.join(""));
      }
    } else if (e.key === "ArrowLeft" && i > 0) refs.current[i - 1]?.focus();
    else if (e.key === "ArrowRight" && i < length - 1) refs.current[i + 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    onChange(text.padEnd(length, "").slice(0, length));
    refs.current[Math.min(text.length, length - 1)]?.focus();
  };

  return (
    <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={el => (refs.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ""}
          onChange={e => handleChange(i, e)}
          onKeyDown={e => handleKeyDown(i, e)}
          onPaste={handlePaste}
          style={{
            width: 50, height: 56, textAlign: "center",
            fontSize: 22, fontWeight: 700, fontFamily: "'Jost', sans-serif",
            border: `2px solid ${value[i] ? T.gold : T.gray100}`,
            borderRadius: 4, outline: "none", background: T.white,
            color: T.navy, transition: "border-color 0.2s",
            boxShadow: value[i] ? `0 0 0 3px rgba(201,168,76,0.15)` : "none",
          }}
        />
      ))}
    </div>
  );
}

/* ─── Star Rating ──────────────────────────────────── */
function Stars({ n }) {
  return (
    <span style={{ color: T.gold, letterSpacing: 1, fontSize: 13 }}>
      {"★".repeat(n)}{"☆".repeat(5 - n)}
    </span>
  );
}

/* ─── NAVBAR ───────────────────────────────────────── */
function Navbar({ page, setPage, user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav style={css.nav}>
      <div onClick={() => setPage("home")} style={{ ...css.navBrand, cursor: "pointer" }}>
        <img
          src="https://i.pinimg.com/736x/ba/22/64/ba226404c8a55abe3381696967f8da00.jpg"
          alt="Royal Grand Logo"
          style={css.navLogoImg}
          onError={e => { e.target.style.display = "none"; }}
        />
        <div style={css.navBrandText}>
          <span style={css.navTitle}>Royal Grand</span>
          <span style={css.navSub}>Luxury Hotels</span>
        </div>
      </div>

      <div style={css.navLinks}>
        <button style={css.navLink} onClick={() => setPage("hotels")}>Hotels</button>
        <button style={css.navLink} onClick={() => setPage("hotels")}>Search</button>
        {user ? (
          <>
            <span style={{ color: T.goldLight, fontSize: 13, letterSpacing: 0.5 }}>
              {user.firstName} {user.lastName}
            </span>
            <button style={css.btnOutlineGold} onClick={onLogout}>Sign Out</button>
          </>
        ) : (
          <>
            <button style={css.navLink} onClick={() => setPage("login")}>Login</button>
            <button style={css.btnGold} onClick={() => setPage("register")}>Sign Up</button>
          </>
        )}
      </div>
    </nav>
  );
}

/* ─── HOME PAGE ────────────────────────────────────── */
function HomePage({ setPage, setSelectedHotel, setBookingHotel, notify }) {
  const [search, setSearch] = useState({ dest: "", checkin: "", checkout: "", guests: 1 });

  const handleSearch = () => {
    setPage("hotels");
    notify("Showing available hotels" + (search.dest ? ` in ${search.dest}` : ""), "success");
  };

  return (
    <div>
      {/* Hero */}
      <div style={{
        position: "relative", minHeight: 660,
        background: `linear-gradient(165deg, ${T.navy} 0%, ${T.navyMid} 45%, #1c3558 100%)`,
        display: "flex", alignItems: "center",
        overflow: "hidden",
      }}>
        {/* decorative lines */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.06,
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 60px, rgba(201,168,76,0.5) 60px, rgba(201,168,76,0.5) 61px), repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(201,168,76,0.5) 60px, rgba(201,168,76,0.5) 61px)",
        }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 2rem", width: "100%", position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 720 }}>
            <span style={{ fontSize: 11, letterSpacing: 5, textTransform: "uppercase", color: T.gold, fontWeight: 600, display: "block", marginBottom: 20 }}>
              Over 500 Premium Hotels Across India
            </span>
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(40px, 6vw, 68px)", fontWeight: 700,
              color: T.white, lineHeight: 1.1, marginBottom: 24,
            }}>
              Your Perfect<br />
              <em style={{ color: T.goldLight, fontStyle: "italic" }}>Getaway Awaits</em>
            </h1>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 20, color: "rgba(255,255,255,0.7)", lineHeight: 1.7,
              marginBottom: 48, maxWidth: 520,
            }}>
              Discover handpicked luxury hotels, seamless booking, and unforgettable experiences — all in one place.
            </p>
          </div>

          {/* Search Bar */}
          <div style={{
            background: T.white, borderRadius: 6, padding: 6,
            display: "flex", alignItems: "stretch", gap: 0,
            maxWidth: 820, boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          }}>
            <div style={{ flex: 3, padding: "10px 16px", borderRight: `1px solid ${T.gray100}` }}>
              <div style={{ fontSize: 10, color: T.gray500, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>Destination</div>
              <input
                placeholder="Where are you going?"
                value={search.dest}
                onChange={e => setSearch({ ...search, dest: e.target.value })}
                style={{ width: "100%", border: "none", outline: "none", fontSize: 15, color: T.navy, background: "transparent", fontFamily: "'Jost', sans-serif" }}
              />
            </div>
            <div style={{ flex: 2, padding: "10px 16px", borderRight: `1px solid ${T.gray100}` }}>
              <div style={{ fontSize: 10, color: T.gray500, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>Check In</div>
              <input type="date" value={search.checkin} onChange={e => setSearch({ ...search, checkin: e.target.value })}
                style={{ border: "none", outline: "none", fontSize: 14, color: T.navy, background: "transparent", fontFamily: "'Jost', sans-serif", width: "100%" }} />
            </div>
            <div style={{ flex: 2, padding: "10px 16px", borderRight: `1px solid ${T.gray100}` }}>
              <div style={{ fontSize: 10, color: T.gray500, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>Check Out</div>
              <input type="date" value={search.checkout} onChange={e => setSearch({ ...search, checkout: e.target.value })}
                style={{ border: "none", outline: "none", fontSize: 14, color: T.navy, background: "transparent", fontFamily: "'Jost', sans-serif", width: "100%" }} />
            </div>
            <div style={{ padding: 6 }}>
              <button onClick={handleSearch} style={{
                ...css.btnGold, height: "100%", padding: "0 28px", whiteSpace: "nowrap",
                display: "flex", alignItems: "center", gap: 8, borderRadius: 4,
              }}>
                <span style={{ fontSize: 16 }}>⊕</span> Search
              </button>
            </div>
          </div>
        </div>

        {/* Hero right image */}
        <div style={{
          position: "absolute", right: 0, top: 0, bottom: 0, width: "38%",
          backgroundImage: `url(https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80)`,
          backgroundSize: "cover", backgroundPosition: "center",
          opacity: 0.35,
          maskImage: "linear-gradient(to right, transparent, black 40%)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 40%)",
        }} />
      </div>

      {/* Stats Bar */}
      <div style={{ background: T.gold }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 2rem", display: "flex", justifyContent: "space-around" }}>
          {[
            { n: "500+", label: "Premium Hotels" },
            { n: "50,000+", label: "Happy Guests" },
            { n: "25+", label: "Cities" },
            { n: "4.8/5", label: "Guest Rating" },
          ].map(s => (
            <div key={s.label} style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: T.navy }}>{s.n}</div>
              <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: T.navyMid, fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Destinations */}
      <div style={{ ...css.section(), padding: "80px 0" }}>
        <div style={css.sectionInner}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span style={css.sectionLabel}>Explore</span>
            <h2 style={css.sectionTitle}>Popular Destinations</h2>
            <hr style={{ ...css.dividerGold, margin: "16px auto 20px" }} />
            <p style={{ ...css.sectionDesc, margin: "0 auto" }}>
              Handpicked cities with India's most stunning hotels
            </p>
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 20,
          }}>
            {DESTINATIONS.map((d, i) => (
              <div key={d.city}
                onClick={() => { setPage("hotels"); }}
                style={{
                  position: "relative", borderRadius: 4, overflow: "hidden",
                  height: i < 3 ? 220 : 190, cursor: "pointer",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
                  transition: "transform 0.25s, box-shadow 0.25s",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.2)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.12)"; }}
              >
                <img src={d.img} alt={d.city} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(to top, rgba(11,22,34,0.85) 30%, transparent)",
                }} />
                <div style={{ position: "absolute", bottom: 16, left: 16 }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: T.white }}>{d.city}</div>
                  <div style={{ fontSize: 11, color: T.goldLight, letterSpacing: 1 }}>{d.count} hotels available</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Luxury Room Types */}
      <div style={{ ...css.section(T.navyMid) }}>
        <div style={css.sectionInner}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span style={{ ...css.sectionLabel, color: T.goldLight }}>Luxury</span>
            <h2 style={css.sectionTitleWhite}>Featured Room Types</h2>
            <hr style={{ ...css.dividerGold, margin: "16px auto 20px" }} />
            <p style={{ ...css.sectionDesc, color: "rgba(255,255,255,0.6)", margin: "0 auto" }}>
              Every room crafted for comfort and elegance
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
            {ROOM_TYPES.map(r => (
              <div key={r.name} style={{
                borderRadius: 4, overflow: "hidden", background: T.navyLight,
                border: `1px solid rgba(201,168,76,0.2)`,
                transition: "transform 0.2s, border-color 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = T.gold; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.borderColor = "rgba(201,168,76,0.2)"; }}
              >
                <div style={{ position: "relative", height: 180 }}>
                  <img src={r.img} alt={r.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{
                    position: "absolute", top: 12, right: 12,
                    background: T.gold, color: T.navy,
                    fontSize: 9, fontWeight: 700, letterSpacing: 1.5,
                    textTransform: "uppercase", padding: "4px 10px", borderRadius: 2,
                  }}>{r.tag}</div>
                </div>
                <div style={{ padding: "18px 16px" }}>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: T.white, marginBottom: 8, fontWeight: 600 }}>{r.name}</h3>
                  <div style={{ fontSize: 12, color: T.gray300, marginBottom: 4 }}>🛏 {r.beds} · {r.sqft} sq ft</div>
                  <div style={{ marginTop: 12, display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
                    <div>
                      <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: T.gold, fontWeight: 700 }}>₹{r.price.toLocaleString()}</span>
                      <span style={{ fontSize: 11, color: T.gray500, marginLeft: 4 }}>/night</span>
                    </div>
                    <button onClick={() => setPage("hotels")} style={{
                      background: "transparent", border: `1px solid ${T.gold}`, color: T.gold,
                      fontSize: 10, letterSpacing: 1, padding: "6px 12px", cursor: "pointer",
                      textTransform: "uppercase", fontFamily: "'Jost', sans-serif", borderRadius: 2,
                    }}>Book</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Premium Hotel Management / Gallery */}
      <div style={{ ...css.section() }}>
        <div style={css.sectionInner}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
            <div>
              <span style={css.sectionLabel}>Premium Hotel Management</span>
              <h2 style={{ ...css.sectionTitle, fontSize: 36 }}>Providing All<br />The Finest Facilities</h2>
              <hr style={css.dividerGold} />
              <p style={css.sectionDesc}>
                From world-class spa retreats to rooftop dining with panoramic views, every Royal Grand property is designed to exceed your expectations. Our concierge team is available around the clock to curate your perfect stay.
              </p>
              <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 16 }}>
                {["24/7 Concierge & Butler Service", "Award-winning Spa & Wellness Centers", "Rooftop Fine Dining Restaurants", "Complimentary Airport Transfers"].map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ color: T.gold, fontSize: 18 }}>✦</span>
                    <span style={{ fontSize: 14, color: T.gray700, fontFamily: "'Cormorant Garamond', serif", fontSize: 16 }}>{f}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => setPage("hotels")} style={{ ...css.btnGold, marginTop: 36, padding: "14px 36px" }}>
                Explore Hotels
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {GALLERY.map((g, i) => (
                <div key={i} style={{
                  borderRadius: 4, overflow: "hidden",
                  height: i % 2 === 0 ? 210 : 170,
                  alignSelf: i % 2 === 0 ? "start" : "end",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
                }}>
                  <img src={g} alt="Hotel" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{
        background: `linear-gradient(135deg, ${T.navy}, ${T.navyMid})`,
        padding: "80px 0",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0, opacity: 0.04,
          backgroundImage: "repeating-linear-gradient(-45deg, rgba(201,168,76,1) 0, rgba(201,168,76,1) 1px, transparent 1px, transparent 50%)",
          backgroundSize: "30px 30px",
        }} />
        <div style={{ ...css.sectionInner, textAlign: "center", position: "relative" }}>
          <span style={{ ...css.sectionLabel, color: T.goldLight }}>Ready for Your Next Adventure?</span>
          <h2 style={{ ...css.sectionTitleWhite, fontSize: 44 }}>
            Join Thousands of Travellers<br />
            <em style={{ fontStyle: "italic", color: T.goldLight }}>Who Book with Royal Grand</em>
          </h2>
          <p style={{ ...css.sectionDesc, color: "rgba(255,255,255,0.65)", margin: "0 auto 40px" }}>
            Over 50,000 happy guests trust Royal Grand for their luxury travel experiences across India's finest destinations.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
            <button onClick={() => setPage("hotels")} style={{ ...css.btnGold, padding: "16px 40px", fontSize: 13 }}>
              Browse Hotels
            </button>
            <button onClick={() => setPage("register")} style={{ ...css.btnOutlineGold, padding: "16px 40px", fontSize: 13 }}>
              Create Free Account
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: T.navy, padding: "64px 0 0", borderTop: `1px solid rgba(201,168,76,0.2)` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 2rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, paddingBottom: 48 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <img src="https://i.pinimg.com/736x/ba/22/64/ba226404c8a55abe3381696967f8da00.jpg"
                  alt="Logo" style={{ width: 40, height: 40, borderRadius: "50%", border: `1px solid ${T.gold}`, objectFit: "cover" }}
                  onError={e => e.target.style.display = "none"} />
                <div>
                  <div style={{ fontFamily: "'Playfair Display', serif", color: T.gold, fontSize: 18, fontWeight: 700 }}>Royal Grand</div>
                  <div style={{ fontSize: 10, color: T.gray500, letterSpacing: 3, textTransform: "uppercase" }}>Luxury Hotels</div>
                </div>
              </div>
              <p style={{ color: T.gray500, fontSize: 14, lineHeight: 1.8, maxWidth: 260, fontFamily: "'Cormorant Garamond', serif", fontSize: 15 }}>
                Luxury hotel bookings across India's finest properties. Experience unparalleled comfort and service.
              </p>
            </div>
            {[
              { heading: "Company", links: ["About Us", "Careers", "Press", "Awards"] },
              { heading: "Support", links: ["Help Centre", "Contact Us", "Privacy Policy", "Terms of Service"] },
              { heading: "Hotels", links: ["List Your Property", "Partner Program", "Corporate Travel", "Gift Cards"] },
            ].map(col => (
              <div key={col.heading}>
                <h4 style={{ color: T.white, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", marginBottom: 20, fontWeight: 600 }}>{col.heading}</h4>
                {col.links.map(l => (
                  <div key={l} style={{ marginBottom: 10 }}>
                    <a href="#" style={{ color: T.gray500, fontSize: 14, textDecoration: "none", transition: "color 0.2s" }}
                      onMouseEnter={e => e.target.style.color = T.goldLight}
                      onMouseLeave={e => e.target.style.color = T.gray500}
                    >{l}</a>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop: `1px solid rgba(201,168,76,0.12)`, padding: "20px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: T.gray500, fontSize: 13 }}>© 2026 Royal Grand Hotels. All rights reserved.</span>
            <div style={{ display: "flex", gap: 24 }}>
              {["Privacy", "Terms", "Sitemap"].map(l => (
                <a key={l} href="#" style={{ color: T.gray500, fontSize: 12, textDecoration: "none", letterSpacing: 1, textTransform: "uppercase" }}>{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ─── HOTELS PAGE ──────────────────────────────────── */
function HotelsPage({ setPage, setSelectedHotel, notify }) {
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("rating");
  const filtered = HOTELS
    .filter(h => !filter || h.city.toLowerCase().includes(filter.toLowerCase()) || h.name.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => sort === "price" ? a.price - b.price : b.rating - a.rating);

  return (
    <div style={{ minHeight: "80vh" }}>
      {/* Page Header */}
      <div style={{
        background: `linear-gradient(135deg, ${T.navy}, ${T.navyMid})`,
        padding: "48px 0 40px",
      }}>
        <div style={css.sectionInner}>
          <span style={css.sectionLabel}>Discover</span>
          <h1 style={{ ...css.sectionTitleWhite, fontSize: 42, marginBottom: 8 }}>Our Hotels</h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 15 }}>500+ premium properties across India</p>
        </div>
      </div>

      <div style={{ ...css.sectionInner, padding: "32px 2rem" }}>
        {/* Filters */}
        <div style={{ display: "flex", gap: 12, marginBottom: 32, alignItems: "center" }}>
          <input
            placeholder="Search city or hotel..."
            value={filter} onChange={e => setFilter(e.target.value)}
            style={{
              flex: 1, maxWidth: 320, padding: "10px 16px",
              border: `1px solid ${T.gray100}`, borderRadius: 4, fontSize: 14,
              fontFamily: "'Jost', sans-serif", outline: "none", color: T.navy,
            }}
          />
          <select value={sort} onChange={e => setSort(e.target.value)} style={{
            padding: "10px 16px", border: `1px solid ${T.gray100}`, borderRadius: 4,
            fontSize: 14, fontFamily: "'Jost', sans-serif", color: T.navy, background: T.white, outline: "none",
          }}>
            <option value="rating">Sort by Rating</option>
            <option value="price">Sort by Price</option>
          </select>
          <span style={{ color: T.gray500, fontSize: 13 }}>{filtered.length} properties found</span>
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {filtered.map(h => (
            <div key={h.id} style={{
              background: T.white, borderRadius: 6, overflow: "hidden",
              border: `1px solid ${T.gray100}`,
              boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
              transition: "transform 0.2s, box-shadow 0.2s", cursor: "pointer",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.12)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 2px 16px rgba(0,0,0,0.06)"; }}
              onClick={() => { setSelectedHotel(h); setPage("hotel-detail"); }}
            >
              <div style={{ position: "relative", height: 200 }}>
                <img src={h.img} alt={h.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{
                  position: "absolute", top: 12, left: 12,
                  background: T.gold, color: T.navy,
                  fontSize: 9, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase",
                  padding: "4px 10px", borderRadius: 2,
                }}>{h.tag}</div>
              </div>
              <div style={{ padding: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 4 }}>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: T.navy, lineHeight: 1.3, flex: 1, marginRight: 8 }}>{h.name}</h3>
                </div>
                <div style={{ fontSize: 12, color: T.gray500, marginBottom: 8 }}>📍 {h.city}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <Stars n={h.stars} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: T.navy }}>{h.rating}</span>
                  <span style={{ fontSize: 12, color: T.gray500 }}>({h.reviews.toLocaleString()} reviews)</span>
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
                  {h.amenities.slice(0, 3).map(a => (
                    <span key={a} style={{
                      fontSize: 10, background: T.gray50, color: T.gray700,
                      padding: "3px 8px", borderRadius: 2, letterSpacing: 0.5,
                    }}>{a}</span>
                  ))}
                  {h.amenities.length > 3 && <span style={{ fontSize: 10, color: T.gray500 }}>+{h.amenities.length - 3}</span>}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: T.navy }}>₹{h.price.toLocaleString()}</span>
                    <span style={{ fontSize: 12, color: T.gray500 }}>/night</span>
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); setSelectedHotel(h); setPage("hotel-detail"); }}
                    style={{ ...css.btnGold, padding: "8px 20px", fontSize: 11 }}
                  >View</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── HOTEL DETAIL PAGE ────────────────────────────── */
function HotelDetailPage({ hotel, setPage, setBookingHotel, user, notify }) {
  if (!hotel) return null;

  const handleBook = (room) => {
    if (!user) { notify("Please sign in to book", "error"); setPage("login"); return; }
    setBookingHotel({ ...hotel, selectedRoom: room });
    setPage("booking");
  };

  return (
    <div style={{ minHeight: "80vh" }}>
      {/* Big Hero Image */}
      <div style={{ height: 420, position: "relative", overflow: "hidden" }}>
        <img src={hotel.img} alt={hotel.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(11,22,34,0.7), transparent 50%)" }} />
        <div style={{ position: "absolute", bottom: 32, left: 0, right: 0, maxWidth: 1200, margin: "0 auto", padding: "0 2rem" }}>
          <button onClick={() => setPage("hotels")} style={{
            background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.4)",
            color: T.white, padding: "8px 16px", borderRadius: 4, cursor: "pointer",
            fontSize: 13, marginBottom: 16, fontFamily: "'Jost', sans-serif",
          }}>← Back to Hotels</button>
          <div style={{ display: "flex", alignItems: "end", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "inline-block", background: T.gold, color: T.navy, fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", padding: "4px 12px", borderRadius: 2, marginBottom: 10 }}>{hotel.tag}</div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 42, fontWeight: 700, color: T.white, marginBottom: 8 }}>{hotel.name}</h1>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Stars n={hotel.stars} />
                <span style={{ color: T.goldLight, fontWeight: 600 }}>{hotel.rating}</span>
                <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>({hotel.reviews.toLocaleString()} reviews)</span>
                <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>📍 {hotel.city}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 2rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 40 }}>
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, color: T.navy, marginBottom: 12 }}>About This Property</h2>
            <hr style={css.dividerGold} />
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, color: T.gray700, lineHeight: 1.8, marginBottom: 24 }}>
              Nestled in the heart of {hotel.city}, {hotel.name} stands as a monument to refined luxury and impeccable hospitality. Each corner of this distinguished property reflects our commitment to providing an extraordinary stay that seamlessly blends timeless elegance with modern sophistication.
            </p>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: T.navy, marginBottom: 16 }}>Amenities & Facilities</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {hotel.amenities.map(a => (
                <div key={a} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: T.gray50, borderRadius: 4 }}>
                  <span style={{ color: T.gold }}>✦</span>
                  <span style={{ fontSize: 14, color: T.gray700 }}>{a}</span>
                </div>
              ))}
            </div>

            {/* Room Types */}
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: T.navy, marginTop: 40, marginBottom: 20 }}>Available Rooms</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {ROOM_TYPES.map(r => (
                <div key={r.name} style={{
                  display: "flex", gap: 20, border: `1px solid ${T.gray100}`,
                  borderRadius: 6, overflow: "hidden", background: T.white,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                }}>
                  <img src={r.img} alt={r.name} style={{ width: 160, height: 120, objectFit: "cover", flexShrink: 0 }} />
                  <div style={{ padding: "16px 16px 16px 4px", display: "flex", flex: 1, alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, color: T.navy, marginBottom: 4 }}>{r.name}</div>
                      <div style={{ fontSize: 13, color: T.gray500, marginBottom: 6 }}>🛏 {r.beds} · {r.sqft} sq ft</div>
                      <span style={{ background: T.goldPale, color: T.navy, fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", padding: "3px 8px", borderRadius: 2 }}>{r.tag}</span>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: T.navy }}>₹{r.price.toLocaleString()}</div>
                      <div style={{ fontSize: 12, color: T.gray500, marginBottom: 10 }}>per night</div>
                      <button onClick={() => handleBook(r)} style={{ ...css.btnGold, padding: "10px 24px", fontSize: 11 }}>Book Now</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div style={{
              background: T.navy, borderRadius: 6, padding: 28,
              border: `1px solid rgba(201,168,76,0.25)`,
              position: "sticky", top: 90,
            }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", color: T.white, fontSize: 20, marginBottom: 4 }}>Starting from</h3>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, color: T.gold, fontWeight: 700, marginBottom: 4 }}>₹{hotel.price.toLocaleString()}</div>
              <div style={{ fontSize: 12, color: T.gray500, marginBottom: 24 }}>per night, taxes included</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
                {["Free cancellation", "Instant confirmation", "24/7 Support", "Best price guarantee"].map(f => (
                  <div key={f} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <span style={{ color: T.gold, fontSize: 14 }}>✓</span>
                    <span style={{ color: "rgba(255,255,255,0.75)", fontSize: 13 }}>{f}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => handleBook(ROOM_TYPES[0])} style={{ ...css.btnGold, width: "100%", padding: "16px", fontSize: 13, borderRadius: 4 }}>
                Book This Hotel
              </button>
              <div style={{ textAlign: "center", marginTop: 12, fontSize: 11, color: T.gray500 }}>No credit card required to check availability</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── BOOKING PAGE ─────────────────────────────────── */
function BookingPage({ hotel, user, setPage, notify }) {
  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  const [form, setForm] = useState({
    checkin: today, checkout: tomorrow, guests: 1, requests: "",
  });
  const [step, setStep] = useState(1); // 1=details, 2=payment, 3=confirmation

  if (!hotel) return null;

  const nights = Math.max(1, Math.ceil((new Date(form.checkout) - new Date(form.checkin)) / 86400000));
  const room = hotel.selectedRoom || ROOM_TYPES[0];
  const subtotal = room.price * nights;
  const taxes = Math.round(subtotal * 0.12);
  const total = subtotal + taxes;

  const handleProceed = () => {
    if (!form.checkin || !form.checkout) { notify("Please select check-in and check-out dates", "error"); return; }
    if (new Date(form.checkout) <= new Date(form.checkin)) { notify("Check-out must be after check-in", "error"); return; }
    setStep(2);
  };

  const handleConfirm = () => {
    const confNo = "RG" + Math.random().toString(36).toUpperCase().slice(2, 8);
    setStep(3);
  };

  return (
    <div style={{ minHeight: "80vh", background: T.gray50, padding: "40px 0" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 2rem" }}>
        <button onClick={() => setPage("hotel-detail")} style={{
          background: "none", border: "none", color: T.gray500, cursor: "pointer",
          fontSize: 14, marginBottom: 24, display: "flex", alignItems: "center", gap: 6,
          fontFamily: "'Jost', sans-serif",
        }}>← Back to hotel</button>

        {/* Steps */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 40, gap: 0 }}>
          {["Stay Details", "Payment", "Confirmation"].map((s, i) => (
            <div key={s} style={{ display: "flex", alignItems: "center", flex: i < 2 ? 1 : "none" }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                background: step > i ? T.gold : step === i + 1 ? T.navy : T.gray100,
                color: step > i ? T.navy : step === i + 1 ? T.white : T.gray500,
                fontSize: 13, fontWeight: 700,
                border: step === i + 1 ? `2px solid ${T.gold}` : "none",
              }}>{step > i ? "✓" : i + 1}</div>
              <span style={{ fontSize: 12, letterSpacing: 1, color: step === i + 1 ? T.navy : T.gray500, marginLeft: 8, textTransform: "uppercase", fontWeight: step === i + 1 ? 700 : 400 }}>{s}</span>
              {i < 2 && <div style={{ flex: 1, height: 1, background: step > i + 1 ? T.gold : T.gray100, margin: "0 16px" }} />}
            </div>
          ))}
        </div>

        {step === 3 ? (
          /* Confirmation */
          <div style={{ textAlign: "center", maxWidth: 560, margin: "0 auto", padding: "60px 40px", background: T.white, borderRadius: 8, boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#e6f4ec", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: 32 }}>✓</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, color: T.navy, marginBottom: 8 }}>Booking Confirmed!</h2>
            <p style={{ color: T.gray500, marginBottom: 24, fontFamily: "'Cormorant Garamond', serif", fontSize: 16 }}>
              Your stay at {hotel.name} is confirmed. A confirmation email has been sent to {user?.email}.
            </p>
            <div style={{ background: T.gray50, borderRadius: 4, padding: "20px", marginBottom: 28, textAlign: "left" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[["Hotel", hotel.name], ["Room", room.name], ["Check-in", form.checkin], ["Check-out", form.checkout], ["Guests", form.guests], ["Total Paid", `₹${total.toLocaleString()}` ]].map(([k, v]) => (
                  <div key={k}>
                    <div style={{ fontSize: 10, color: T.gray500, textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 }}>{k}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: T.navy }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={() => setPage("home")} style={{ ...css.btnGold, padding: "14px 40px" }}>Back to Home</button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 28 }}>
            {/* Main Form */}
            <div style={{ background: T.white, borderRadius: 8, overflow: "hidden", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
              {step === 1 && (
                <div>
                  <div style={{ padding: "24px 28px", borderBottom: `1px solid ${T.gray100}`, display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ color: T.gold, fontSize: 20 }}>📅</span>
                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: T.navy }}>Stay Details</h2>
                  </div>
                  <div style={{ padding: 28, display: "flex", flexDirection: "column", gap: 20 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                      {[
                        { label: "Check-In Date", key: "checkin", type: "date" },
                        { label: "Check-Out Date", key: "checkout", type: "date" },
                      ].map(f => (
                        <div key={f.key}>
                          <label style={{ fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: T.gray500, fontWeight: 600, display: "block", marginBottom: 8 }}>{f.label}</label>
                          <input
                            type={f.type} value={form[f.key]}
                            onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                            style={{
                              width: "100%", padding: "12px 14px", border: `1px solid ${T.gray100}`,
                              borderRadius: 4, fontSize: 14, fontFamily: "'Jost', sans-serif",
                              outline: "none", color: T.navy, boxSizing: "border-box",
                            }}
                          />
                        </div>
                      ))}
                    </div>
                    <div>
                      <label style={{ fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: T.gray500, fontWeight: 600, display: "block", marginBottom: 8 }}>Number of Guests</label>
                      <select value={form.guests} onChange={e => setForm({ ...form, guests: Number(e.target.value) })}
                        style={{ width: "100%", padding: "12px 14px", border: `1px solid ${T.gray100}`, borderRadius: 4, fontSize: 14, fontFamily: "'Jost', sans-serif", outline: "none", color: T.navy, background: T.white }}>
                        {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n} Guest{n > 1 ? "s" : ""}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: T.gray500, fontWeight: 600, display: "block", marginBottom: 8 }}>Special Requests (Optional)</label>
                      <textarea
                        value={form.requests}
                        onChange={e => setForm({ ...form, requests: e.target.value })}
                        placeholder="e.g. Early check-in, extra pillows, quiet room..."
                        rows={3}
                        style={{
                          width: "100%", padding: "12px 14px", border: `1px solid ${T.gray100}`,
                          borderRadius: 4, fontSize: 14, fontFamily: "'Jost', sans-serif",
                          outline: "none", resize: "vertical", color: T.navy, boxSizing: "border-box",
                        }}
                      />
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", padding: "12px 16px", background: "#f0f7ff", borderRadius: 4, fontSize: 13, color: "#1a4f8c" }}>
                      <span>ℹ</span>
                      Free cancellation up to 24 hours before check-in. Payment will be processed on the next step.
                    </div>
                    <button onClick={handleProceed} style={{ ...css.btnGold, padding: "16px", fontSize: 13, textAlign: "center", borderRadius: 4 }}>
                      Proceed to Payment — ₹{total.toLocaleString()}
                    </button>
                  </div>
                </div>
              )}
              {step === 2 && (
                <div>
                  <div style={{ padding: "24px 28px", borderBottom: `1px solid ${T.gray100}`, display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ color: T.gold, fontSize: 20 }}>💳</span>
                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: T.navy }}>Payment Details</h2>
                  </div>
                  <div style={{ padding: 28, display: "flex", flexDirection: "column", gap: 20 }}>
                    <div>
                      <label style={{ fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: T.gray500, fontWeight: 600, display: "block", marginBottom: 8 }}>Card Number</label>
                      <input placeholder="•••• •••• •••• ••••" style={{
                        width: "100%", padding: "12px 14px", border: `1px solid ${T.gray100}`, borderRadius: 4, fontSize: 14, fontFamily: "'Jost', sans-serif", outline: "none", color: T.navy, boxSizing: "border-box",
                      }} />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                      {[["Cardholder Name", "Full name"], ["Expiry", "MM/YY"], ["CVV", "•••"]].map(([l, p]) => (
                        <div key={l}>
                          <label style={{ fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: T.gray500, fontWeight: 600, display: "block", marginBottom: 8 }}>{l}</label>
                          <input placeholder={p} style={{ width: "100%", padding: "12px 14px", border: `1px solid ${T.gray100}`, borderRadius: 4, fontSize: 14, fontFamily: "'Jost', sans-serif", outline: "none", color: T.navy, boxSizing: "border-box" }} />
                        </div>
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <div style={{ width: 20, height: 20, borderRadius: 4, border: `2px solid ${T.gold}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 12 }}>✓</div>
                      <span style={{ fontSize: 13, color: T.gray700 }}>I agree to the booking terms and cancellation policy</span>
                    </div>
                    <button onClick={handleConfirm} style={{ ...css.btnGold, padding: "16px", fontSize: 13, textAlign: "center", borderRadius: 4 }}>
                      Confirm Booking — ₹{total.toLocaleString()}
                    </button>
                    <button onClick={() => setStep(1)} style={{ background: "none", border: "none", color: T.gray500, cursor: "pointer", fontSize: 13, fontFamily: "'Jost', sans-serif" }}>← Back to Stay Details</button>
                  </div>
                </div>
              )}
            </div>

            {/* Booking Summary Sidebar */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ background: T.white, borderRadius: 8, overflow: "hidden", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
                <img src={hotel.img} alt={hotel.name} style={{ width: "100%", height: 160, objectFit: "cover" }} />
                <div style={{ padding: 20 }}>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, color: T.navy, marginBottom: 4 }}>{hotel.name}</h3>
                  <div style={{ fontSize: 12, color: T.gray500, marginBottom: 8 }}>📍 {hotel.city}</div>
                  <Stars n={hotel.stars} />
                  <hr style={{ border: "none", borderTop: `1px solid ${T.gray100}`, margin: "16px 0" }} />
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, color: T.navy, fontWeight: 700, marginBottom: 12 }}>{room.name}</div>
                  {[
                    ["Check-in", form.checkin],
                    ["Check-out", form.checkout],
                    ["Guests", `${form.guests} Guest${form.guests > 1 ? "s" : ""}`],
                    ["Duration", `${nights} Night${nights > 1 ? "s" : ""}`],
                  ].map(([k, v]) => (
                    <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ fontSize: 13, color: T.gray500 }}>{k}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: T.navy }}>{v}</span>
                    </div>
                  ))}
                  <hr style={{ border: "none", borderTop: `1px solid ${T.gray100}`, margin: "12px 0" }} />
                  {[
                    ["Subtotal", `₹${subtotal.toLocaleString()}`],
                    ["Taxes & Fees (12%)", `₹${taxes.toLocaleString()}`],
                  ].map(([k, v]) => (
                    <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ fontSize: 13, color: T.gray500 }}>{k}</span>
                      <span style={{ fontSize: 13, color: T.navy }}>{v}</span>
                    </div>
                  ))}
                  <hr style={{ border: "none", borderTop: `1px solid ${T.gray100}`, margin: "12px 0" }} />
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontWeight: 700, fontSize: 15, color: T.navy }}>Total</span>
                    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: T.navy }}>₹{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── LOGIN PAGE ───────────────────────────────────── */
function LoginPage({ setPage, setUser, notify }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!form.email || !form.password) { notify("Please fill in all fields", "error"); return; }
    if (!/\S+@\S+\.\S+/.test(form.email)) { notify("Please enter a valid email", "error"); return; }
    setLoading(true);
    setTimeout(() => {
      const name = form.email.split("@")[0].split(".").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
      setUser({ firstName: name, lastName: "", email: form.email });
      notify("Welcome back to Royal Grand!", "success");
      setPage("home");
      setLoading(false);
    }, 1200);
  };

  return (
    <div style={{
      minHeight: "calc(100vh - 72px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      background: T.gray50, padding: "40px 16px",
    }}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <img src="https://i.pinimg.com/736x/ba/22/64/ba226404c8a55abe3381696967f8da00.jpg"
            alt="Royal Grand" style={{ width: 64, height: 64, borderRadius: "50%", border: `3px solid ${T.gold}`, objectFit: "cover", marginBottom: 12 }}
            onError={e => e.target.style.display = "none"} />
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: T.navy, marginBottom: 4 }}>Welcome Back</h1>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, color: T.gray500 }}>Sign in to continue your luxury experience</p>
        </div>

        <div style={{ background: T.white, borderRadius: 8, padding: "40px 36px", boxShadow: "0 4px 32px rgba(0,0,0,0.08)" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <label style={{ fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: T.gray500, fontWeight: 600, display: "block", marginBottom: 8 }}>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                style={{
                  width: "100%", padding: "12px 14px", border: `1px solid ${T.gray100}`,
                  borderRadius: 4, fontSize: 14, fontFamily: "'Jost', sans-serif",
                  outline: "none", color: T.navy, boxSizing: "border-box",
                  transition: "border-color 0.2s",
                }}
                onFocus={e => e.target.style.borderColor = T.gold}
                onBlur={e => e.target.style.borderColor = T.gray100}
              />
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <label style={{ fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: T.gray500, fontWeight: 600 }}>Password</label>
                <button onClick={() => notify("Password reset link sent!", "success")} style={{ background: "none", border: "none", color: T.gold, fontSize: 12, cursor: "pointer", fontFamily: "'Jost', sans-serif" }}>
                  Forgot password?
                </button>
              </div>
              <div style={{ position: "relative" }}>
                <input
                  type={showPw ? "text" : "password"}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  onKeyDown={e => e.key === "Enter" && handleLogin()}
                  style={{
                    width: "100%", padding: "12px 44px 12px 14px", border: `1px solid ${T.gray100}`,
                    borderRadius: 4, fontSize: 14, fontFamily: "'Jost', sans-serif",
                    outline: "none", color: T.navy, boxSizing: "border-box",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={e => e.target.style.borderColor = T.gold}
                  onBlur={e => e.target.style.borderColor = T.gray100}
                />
                <button onClick={() => setShowPw(!showPw)} style={{
                  position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer", color: T.gray500, fontSize: 16,
                }}>{showPw ? "🙈" : "👁"}</button>
              </div>
            </div>
            <button onClick={handleLogin} disabled={loading} style={{
              ...css.btnGold, padding: "15px", fontSize: 13, borderRadius: 4,
              opacity: loading ? 0.7 : 1, transition: "opacity 0.2s",
            }}>
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </div>
          <div style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: T.gray500 }}>
            Don't have an account?{" "}
            <button onClick={() => setPage("register")} style={{ background: "none", border: "none", color: T.gold, cursor: "pointer", fontWeight: 600, fontSize: 14, fontFamily: "'Jost', sans-serif" }}>
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── REGISTER PAGE ────────────────────────────────── */
function RegisterPage({ setPage, setUser, notify }) {
  const [step, setStep] = useState(1); // 1=form, 2=otp
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", password: "", confirm: "" });
  const [otp, setOtp] = useState("");
  const [sentOtp, setSentOtp] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer(r => r - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendTimer]);

  const handleSendOtp = () => {
    if (!form.firstName || !form.lastName) { notify("Please enter your name", "error"); return; }
    if (!/\S+@\S+\.\S+/.test(form.email)) { notify("Please enter a valid email", "error"); return; }
    if (!form.phone || form.phone.length < 10) { notify("Please enter a valid phone number", "error"); return; }
    if (form.password.length < 6) { notify("Password must be at least 6 characters", "error"); return; }
    if (form.password !== form.confirm) { notify("Passwords do not match", "error"); return; }
    setLoading(true);
    const code = String(Math.floor(100000 + Math.random() * 900000));
    setTimeout(() => {
      setSentOtp(code);
      setStep(2);
      setResendTimer(30);
      notify(`OTP sent to ${form.email} — Demo code: ${code}`, "success");
      setLoading(false);
    }, 1000);
  };

  const handleVerifyOtp = () => {
    if (otp.length < 6) { notify("Please enter the complete 6-digit OTP", "error"); return; }
    if (otp !== sentOtp) { notify("Incorrect OTP. Please try again.", "error"); setOtp(""); return; }
    setLoading(true);
    setTimeout(() => {
      setUser({ firstName: form.firstName, lastName: form.lastName, email: form.email });
      notify(`Welcome to Royal Grand, ${form.firstName}!`, "success");
      setPage("home");
      setLoading(false);
    }, 800);
  };

  const handleResend = () => {
    const code = String(Math.floor(100000 + Math.random() * 900000));
    setSentOtp(code);
    setOtp("");
    setResendTimer(30);
    notify(`New OTP sent — Demo code: ${code}`, "success");
  };

  const F = ({ label, placeholder, k, type = "text" }) => (
    <div>
      <label style={{ fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: T.gray500, fontWeight: 600, display: "block", marginBottom: 8 }}>{label}</label>
      <input type={type} value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} placeholder={placeholder}
        style={{ width: "100%", padding: "12px 14px", border: `1px solid ${T.gray100}`, borderRadius: 4, fontSize: 14, fontFamily: "'Jost', sans-serif", outline: "none", color: T.navy, boxSizing: "border-box", transition: "border-color 0.2s" }}
        onFocus={e => e.target.style.borderColor = T.gold} onBlur={e => e.target.style.borderColor = T.gray100} />
    </div>
  );

  return (
    <div style={{ minHeight: "calc(100vh - 72px)", display: "flex", alignItems: "center", justifyContent: "center", background: T.gray50, padding: "40px 16px" }}>
      <div style={{ width: "100%", maxWidth: 480 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <img src="https://i.pinimg.com/736x/ba/22/64/ba226404c8a55abe3381696967f8da00.jpg"
            alt="Royal Grand" style={{ width: 64, height: 64, borderRadius: "50%", border: `3px solid ${T.gold}`, objectFit: "cover", marginBottom: 12 }}
            onError={e => e.target.style.display = "none"} />
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: T.navy, marginBottom: 4 }}>
            {step === 1 ? "Create Your Account" : "Verify Your Email"}
          </h1>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, color: T.gray500 }}>
            {step === 1 ? "Join Royal Grand for exclusive benefits" : `OTP sent to ${form.email}`}
          </p>
        </div>

        <div style={{ background: T.white, borderRadius: 8, padding: "40px 36px", boxShadow: "0 4px 32px rgba(0,0,0,0.08)" }}>
          {step === 1 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <F label="First Name" k="firstName" placeholder="" />
                <F label="Last Name"  k="lastName"  placeholder="" />
              </div>
              <F label="Email Address" k="email" type="email" placeholder="" />
              <div>
                <label style={{ fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: T.gray500, fontWeight: 600, display: "block", marginBottom: 8 }}>Phone Number</label>
                <div style={{ display: "flex" }}>
                  <span style={{ padding: "12px 12px", border: `1px solid ${T.gray100}`, borderRight: "none", borderRadius: "4px 0 0 4px", fontSize: 14, color: T.gray700, background: T.gray50 }}>+91</span>
                  <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                    style={{ flex: 1, padding: "12px 14px", border: `1px solid ${T.gray100}`, borderRadius: "0 4px 4px 0", fontSize: 14, fontFamily: "'Jost', sans-serif", outline: "none", color: T.navy }}
                    onFocus={e => e.target.style.borderColor = T.gold} onBlur={e => e.target.style.borderColor = T.gray100} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: T.gray500, fontWeight: 600, display: "block", marginBottom: 8 }}>Password</label>
                <div style={{ position: "relative" }}>
                  <input type={showPw ? "text" : "password"} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                    style={{ width: "100%", padding: "12px 44px 12px 14px", border: `1px solid ${T.gray100}`, borderRadius: 4, fontSize: 14, fontFamily: "'Jost', sans-serif", outline: "none", color: T.navy, boxSizing: "border-box" }}
                    onFocus={e => e.target.style.borderColor = T.gold} onBlur={e => e.target.style.borderColor = T.gray100} />
                  <button onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: T.gray500, fontSize: 16 }}>{showPw ? "🙈" : "👁"}</button>
                </div>
              </div>
              <div>
                <label style={{ fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: T.gray500, fontWeight: 600, display: "block", marginBottom: 8 }}>Confirm Password</label>
                <input type="password" value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })}
                  style={{ width: "100%", padding: "12px 14px", border: `1px solid ${T.gray100}`, borderRadius: 4, fontSize: 14, fontFamily: "'Jost', sans-serif", outline: "none", color: T.navy, boxSizing: "border-box" }}
                  onFocus={e => e.target.style.borderColor = T.gold} onBlur={e => e.target.style.borderColor = T.gray100} />
              </div>
              <button onClick={handleSendOtp} disabled={loading} style={{ ...css.btnGold, padding: "15px", fontSize: 13, borderRadius: 4, opacity: loading ? 0.7 : 1, marginTop: 4 }}>
                {loading ? "Sending OTP..." : "Create Account & Verify"}
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 24, alignItems: "center" }}>
              <div style={{ textAlign: "center", width: "100%" }}>
                <p style={{ fontSize: 14, color: T.gray700, marginBottom: 24, lineHeight: 1.7 }}>
                  We've sent a 6-digit verification code to<br />
                  <strong style={{ color: T.navy }}>{form.email}</strong>
                </p>
                <OTPInput length={6} value={otp} onChange={setOtp} />
              </div>
              <button onClick={handleVerifyOtp} disabled={loading || otp.length < 6} style={{
                ...css.btnGold, padding: "15px 48px", fontSize: 13, borderRadius: 4,
                opacity: (loading || otp.length < 6) ? 0.6 : 1, width: "100%",
              }}>
                {loading ? "Verifying..." : "Verify & Create Account"}
              </button>
              <div style={{ textAlign: "center", fontSize: 13, color: T.gray500 }}>
                {resendTimer > 0 ? (
                  <span>Resend OTP in {resendTimer}s</span>
                ) : (
                  <button onClick={handleResend} style={{ background: "none", border: "none", color: T.gold, cursor: "pointer", fontSize: 13, fontFamily: "'Jost', sans-serif", fontWeight: 600 }}>
                    Resend OTP
                  </button>
                )}
              </div>
              <button onClick={() => { setStep(1); setOtp(""); }} style={{ background: "none", border: "none", color: T.gray500, cursor: "pointer", fontSize: 13, fontFamily: "'Jost', sans-serif" }}>
                ← Back to Registration
              </button>
            </div>
          )}
          <div style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: T.gray500 }}>
            Already have an account?{" "}
            <button onClick={() => setPage("login")} style={{ background: "none", border: "none", color: T.gold, cursor: "pointer", fontWeight: 600, fontSize: 14, fontFamily: "'Jost', sans-serif" }}>
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── ROOT APP ─────────────────────────────────────── */
export default function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState({ msg: "", type: "info" });
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [bookingHotel, setBookingHotel] = useState(null);

  const notify = (msg, type = "info") => setNotification({ msg, type });

  const handleLogout = () => {
    setUser(null);
    notify("You have been signed out", "info");
    setPage("home");
  };

  return (
    <div style={css.root}>
      <FontLink />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        button:hover { opacity: 0.9; }
        input[type="date"]::-webkit-calendar-picker-indicator { cursor: pointer; opacity: 0.6; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #f1f1f1; } ::-webkit-scrollbar-thumb { background: #C9A84C; border-radius: 3px; }
      `}</style>

      <Notification msg={notification.msg} type={notification.type} onClose={() => setNotification({ msg: "", type: "info" })} />
      <Navbar page={page} setPage={setPage} user={user} onLogout={handleLogout} />

      {page === "home" && (
        <HomePage setPage={setPage} setSelectedHotel={setSelectedHotel} setBookingHotel={setBookingHotel} notify={notify} />
      )}
      {page === "hotels" && (
        <HotelsPage setPage={setPage} setSelectedHotel={setSelectedHotel} notify={notify} />
      )}
      {page === "hotel-detail" && (
        <HotelDetailPage hotel={selectedHotel} setPage={setPage} setBookingHotel={setBookingHotel} user={user} notify={notify} />
      )}
      {page === "booking" && (
        <BookingPage hotel={bookingHotel} user={user} setPage={setPage} notify={notify} />
      )}
      {page === "login" && (
        <LoginPage setPage={setPage} setUser={setUser} notify={notify} />
      )}
      {page === "register" && (
        <RegisterPage setPage={setPage} setUser={setUser} notify={notify} />
      )}
    </div>
  );
}
