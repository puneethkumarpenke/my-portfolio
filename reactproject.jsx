import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Github, Linkedin, Mail, Phone, MapPin, ExternalLink,
  Code2, Server, Database, Wrench, ChevronDown, Send,
  Lock, X, CheckCircle2, Loader2, Terminal
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Design tokens: dev-console theme.                                   */
/* Charcoal surfaces, cyan + amber dual accent, three-role type system */
/* ------------------------------------------------------------------ */

const FULL_NAME = "Puneeth Kumar Penke";
const ROLE_LINE = "Full-Stack Developer";
const TYPED_STRINGS = [
  "const dev = { stack: 'React · Node · Python' };",
  "focus: 'clean code, fast iteration, real outcomes';",
  "open_to: ['Full-Stack Roles', 'QA Engineering'];",
];

const SKILLS = {
  Frontend: { icon: Code2, items: ["HTML", "CSS", "Bootstrap", "JavaScript", "React.js", "Next.js"] },
  Backend: { icon: Server, items: ["Node.js", "Express.js", "Python", "Flask", "REST APIs"] },
  Databases: { icon: Database, items: ["SQLite", "MongoDB"] },
  Other: { icon: Wrench, items: ["C++", "Java", "Git", "Linux", "Vercel", "AWS", "DSA"] },
};

const PROJECTS = [
  {
    title: "Explainability-Driven Anaemia Prediction System",
    link: "https://github.com/puneethkumarpenke/ED_APP",
    stack: "Python · Flask · FastAPI · ML",
    points: [
      "Built a healthcare prediction REST API achieving 89% accuracy across 3 ML models (Logistic Regression, Random Forest, XGBoost) on 1,200+ patient records.",
      "Reduced false-negative rate by 15% via optimized preprocessing and a custom trust-scoring mechanism.",
    ],
  },
  {
    title: "Todos Application",
    link: "https://puneethproject.ccbp.tech",
    stack: "HTML · CSS · JavaScript · Bootstrap",
    points: [
      "Full CRUD task manager with unlimited create/update/delete, no page reload.",
      "localStorage persistence for 100% task retention across sessions.",
      "Mobile-first layout consistent across 5+ screen sizes.",
    ],
  },
  {
    title: "Tourism Website",
    link: "https://puneethproject2.ccbp.tech",
    stack: "HTML · CSS · Bootstrap",
    points: [
      "Travel guide covering 10+ destinations with image carousels and embedded virtual tours.",
      "Flexbox + Bootstrap layout that cut mobile bounce rate.",
    ],
  },
];

const TIMELINE = [
  { tag: "WORK", title: "Full Stack Developer Intern — LVC Solutions", period: "Jul 2026 – Present", desc: "Real-time full-stack development with React.js, Next.js, Node.js, AngularJS. API integration, DB design, Git workflows, Vercel deployments." },
  { tag: "CERT", title: "Industry Ready Certification — Full-Stack Development", period: "Nxtwave Disruptive Technologies · 2023 – Ongoing", desc: "" },
  { tag: "EDU", title: "B.Tech, Computer Science Engineering — CGPA 7.4", period: "QIS College of Engineering and Technology · 2022 – 2026", desc: "" },
  { tag: "EDU", title: "Intermediate (MPC) — 84.0%", period: "Narayana Junior College · 2020 – 2022", desc: "" },
  { tag: "EDU", title: "SSC — 97.0%", period: "Andhra High School · 2019 – 2020", desc: "" },
];

const CERTS = [
  "Web Full Stack Developer & Python Full Stack Developer Virtual Internship — EduSkills Foundation",
  "Problem Solving Skill Certificate — HackerRank (Python Intermediate)",
];

const ACHIEVEMENTS = [
  "National Level Project Expo Participant — QISFEST 2025: competed among 50+ teams presenting to industry & faculty judges.",
];

/* ------------------------------------------------------------------ */

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ children, delay = 0, className = "" }) {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s cubic-bezier(.16,1,.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function TiltCard({ children, className = "" }) {
  const ref = useRef(null);
  const onMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
  }, []);
  const onLeave = useCallback(() => {
    const el = ref.current;
    if (el) el.style.transform = "perspective(800px) rotateY(0) rotateX(0) translateY(0)";
  }, []);
  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
      style={{ transition: "transform 0.25s ease", transformStyle: "preserve-3d" }}
    >
      {children}
    </div>
  );
}

function useTypedLines(lines, speed = 32, pause = 1400) {
  const [text, setText] = useState("");
  const [lineIdx, setLineIdx] = useState(0);
  useEffect(() => {
    let i = 0;
    let timeout;
    const full = lines[lineIdx];
    function tick() {
      i++;
      setText(full.slice(0, i));
      if (i < full.length) {
        timeout = setTimeout(tick, speed);
      } else {
        timeout = setTimeout(() => {
          setText("");
          setLineIdx((prev) => (prev + 1) % lines.length);
        }, pause);
      }
    }
    timeout = setTimeout(tick, speed);
    return () => clearTimeout(timeout);
  }, [lineIdx]);
  return text;
}

/* ------------------------------------------------------------------ */

export default function Portfolio() {
  const typed = useTypedLines(TYPED_STRINGS);

  // ---- contact form + storage-backed "database" ----
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | saving | done | error

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus("saving");
    try {
      const key = `messages:${Date.now()}`;
      const entry = { ...form, date: new Date().toISOString() };
      const result = await window.storage.set(key, JSON.stringify(entry), true);
      if (!result) throw new Error("no result");
      setStatus("done");
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      console.error("Storage error:", err);
      setStatus("error");
    }
  };

  // ---- lightweight admin panel to read stored messages ----
  const [adminOpen, setAdminOpen] = useState(false);
  const [pass, setPass] = useState("");
  const [authed, setAuthed] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loadingMsgs, setLoadingMsgs] = useState(false);

  const loadMessages = async () => {
    setLoadingMsgs(true);
    try {
      const list = await window.storage.list("messages:", true);
      const keys = list?.keys || [];
      const items = [];
      for (const k of keys) {
        try {
          const r = await window.storage.get(k, true);
          if (r?.value) items.push(JSON.parse(r.value));
        } catch { /* skip unreadable key */ }
      }
      items.sort((a, b) => new Date(b.date) - new Date(a.date));
      setMessages(items);
    } catch (err) {
      console.error(err);
    }
    setLoadingMsgs(false);
  };

  useEffect(() => { if (authed) loadMessages(); }, [authed]);

  return (
    <div style={{ background: "#0E1015", color: "#E7E9EE", minHeight: "100%", fontFamily: "'Inter', sans-serif", position: "relative", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        .font-display { font-family: 'Space Grotesk', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        @keyframes floatY { 0%,100% { transform: translateY(0);} 50% { transform: translateY(-14px);} }
        @keyframes pulseGlow { 0%,100% { opacity: .55; } 50% { opacity: 1; } }
        @keyframes blink { 0%,49% { opacity: 1;} 50%,100% { opacity: 0;} }
        @keyframes gradientShift { 0% { background-position: 0% 50%;} 50% { background-position: 100% 50%;} 100% { background-position: 0% 50%;} }
        .bg-mesh {
          background: radial-gradient(circle at 20% 20%, rgba(76,201,240,0.18), transparent 40%),
                      radial-gradient(circle at 80% 30%, rgba(255,184,108,0.14), transparent 45%),
                      radial-gradient(circle at 50% 90%, rgba(76,201,240,0.10), transparent 45%);
        }
        .chip { transition: transform .2s ease, background .2s ease, border-color .2s ease; }
        .chip:hover { transform: translateY(-3px); border-color: #4CC9F0; background: rgba(76,201,240,0.08); }
        .nav-link { position: relative; }
        .nav-link::after { content:''; position:absolute; left:0; bottom:-4px; width:0; height:1px; background:#4CC9F0; transition: width .25s ease; }
        .nav-link:hover::after { width: 100%; }
        .project-card { transition: box-shadow .3s ease, border-color .3s ease; }
        .project-card:hover { border-color: rgba(76,201,240,0.5); box-shadow: 0 20px 50px -20px rgba(76,201,240,0.35); }
        .cursor-blink { animation: blink 1s step-end infinite; }
        .float-slow { animation: floatY 6s ease-in-out infinite; }
        .btn-send { transition: transform .2s ease, box-shadow .2s ease; }
        .btn-send:hover { transform: translateY(-2px); box-shadow: 0 10px 30px -8px rgba(76,201,240,0.5); }
        input, textarea { transition: border-color .2s ease, background .2s ease; }
        input:focus, textarea:focus { outline: none; border-color: #4CC9F0 !important; background: rgba(255,255,255,0.04) !important; }
        ::selection { background: #4CC9F0; color: #0E1015; }
      `}</style>

      {/* ---------------- NAV ---------------- */}
      <nav style={{ position: "sticky", top: 0, zIndex: 40, backdropFilter: "blur(10px)", background: "rgba(14,16,21,0.75)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span className="font-mono" style={{ fontSize: 14, color: "#4CC9F0", letterSpacing: 1 }}>~/puneeth</span>
          <div style={{ display: "flex", gap: 28, fontSize: 14 }} className="font-mono">
            {["about", "skills", "projects", "timeline", "contact"].map((s) => (
              <a key={s} href={`#${s}`} className="nav-link" style={{ color: "#B7BCC7", textDecoration: "none" }}>{s}</a>
            ))}
          </div>
        </div>
      </nav>

      {/* ---------------- HERO ---------------- */}
      <header className="bg-mesh" style={{ minHeight: "78vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "60px 24px", position: "relative" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", width: "100%" }}>
          <div className="font-mono float-slow" style={{ display: "inline-block", fontSize: 13, color: "#FFB86C", border: "1px solid rgba(255,184,108,0.35)", padding: "4px 12px", borderRadius: 999, marginBottom: 22 }}>
            <Terminal size={12} style={{ display: "inline", marginRight: 6, marginBottom: -1 }} />
            available for full-stack & QA roles
          </div>
          <h1 className="font-display" style={{ fontSize: "clamp(2.4rem, 6vw, 4.2rem)", fontWeight: 700, lineHeight: 1.05, margin: 0 }}>
            {FULL_NAME}
          </h1>
          <p className="font-display" style={{ fontSize: "clamp(1.1rem, 2.4vw, 1.6rem)", color: "#4CC9F0", marginTop: 10, fontWeight: 500 }}>
            {ROLE_LINE}
          </p>

          <div className="font-mono" style={{ marginTop: 34, background: "#14171D", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "18px 20px", maxWidth: 620, fontSize: 14, color: "#8FE3C7" }}>
            <span style={{ color: "#5A606B" }}>$ </span>{typed}<span className="cursor-blink">▌</span>
          </div>

          <p style={{ maxWidth: 600, color: "#AEB3BE", marginTop: 26, lineHeight: 1.7, fontSize: 15 }}>
            Motivated Computer Science Engineer building web applications with React.js, Node.js, and Python — with a growing interest in UI/UX and QA Engineering.
          </p>

          <div style={{ display: "flex", gap: 14, marginTop: 30, flexWrap: "wrap" }}>
            <a href="#contact" className="btn-send" style={{ background: "#4CC9F0", color: "#0E1015", padding: "12px 22px", borderRadius: 8, fontWeight: 600, fontSize: 14, textDecoration: "none" }}>Get in touch</a>
            <a href="https://github.com/puneethkumarpenke" target="_blank" rel="noreferrer" className="chip" style={{ border: "1px solid rgba(255,255,255,0.15)", padding: "12px 22px", borderRadius: 8, fontSize: 14, color: "#E7E9EE", textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
              <Github size={16} /> GitHub
            </a>
          </div>
        </div>
        <ChevronDown className="float-slow" size={26} style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", color: "#4CC9F0" }} />
      </header>

      {/* ---------------- SKILLS ---------------- */}
      <section id="skills" style={{ padding: "90px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <Reveal><Eyebrow n="01" label="Stack" /></Reveal>
        <Reveal delay={80}><h2 className="font-display" style={{ fontSize: "clamp(1.6rem,3vw,2.2rem)", marginBottom: 40 }}>Technical Skills</h2></Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 20 }}>
          {Object.entries(SKILLS).map(([cat, { icon: Icon, items }], i) => (
            <Reveal key={cat} delay={i * 90}>
              <div style={{ border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 22, background: "#12151B", height: "100%" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <Icon size={18} color="#4CC9F0" />
                  <span className="font-display" style={{ fontWeight: 700 }}>{cat}</span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {items.map((it) => (
                    <span key={it} className="chip font-mono" style={{ fontSize: 12, border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "5px 10px", color: "#C7CBD4" }}>{it}</span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- PROJECTS ---------------- */}
      <section id="projects" style={{ padding: "60px 24px 90px", maxWidth: 1100, margin: "0 auto" }}>
        <Reveal><Eyebrow n="02" label="Work" /></Reveal>
        <Reveal delay={80}><h2 className="font-display" style={{ fontSize: "clamp(1.6rem,3vw,2.2rem)", marginBottom: 40 }}>Selected Projects</h2></Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 22 }}>
          {PROJECTS.map((p, i) => (
            <Reveal key={p.title} delay={i * 100}>
              <TiltCard className="project-card" >
                <div style={{ border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: 24, background: "linear-gradient(160deg,#14171D,#101318)", height: "100%" }}>
                  <div className="font-mono" style={{ fontSize: 11, color: "#FFB86C", marginBottom: 10 }}>{p.stack}</div>
                  <h3 className="font-display" style={{ fontSize: 17, marginBottom: 12, lineHeight: 1.35 }}>{p.title}</h3>
                  <ul style={{ paddingLeft: 18, color: "#AEB3BE", fontSize: 13.5, lineHeight: 1.65, margin: 0 }}>
                    {p.points.map((pt) => <li key={pt} style={{ marginBottom: 6 }}>{pt}</li>)}
                  </ul>
                  <a href={p.link} target="_blank" rel="noreferrer" style={{ marginTop: 16, display: "inline-flex", alignItems: "center", gap: 6, color: "#4CC9F0", fontSize: 13, textDecoration: "none" }}>
                    View project <ExternalLink size={13} />
                  </a>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- TIMELINE ---------------- */}
      <section id="timeline" style={{ padding: "60px 24px 90px", maxWidth: 900, margin: "0 auto" }}>
        <Reveal><Eyebrow n="03" label="Path" /></Reveal>
        <Reveal delay={80}><h2 className="font-display" style={{ fontSize: "clamp(1.6rem,3vw,2.2rem)", marginBottom: 44 }}>Experience & Education</h2></Reveal>
        <div style={{ position: "relative", paddingLeft: 26 }}>
          <div style={{ position: "absolute", left: 5, top: 6, bottom: 6, width: 1, background: "linear-gradient(#4CC9F0, rgba(76,201,240,0))" }} />
          {TIMELINE.map((t, i) => (
            <Reveal key={t.title} delay={i * 90}>
              <div style={{ position: "relative", marginBottom: 30 }}>
                <span style={{ position: "absolute", left: -26, top: 4, width: 10, height: 10, borderRadius: "50%", background: "#4CC9F0", boxShadow: "0 0 0 4px rgba(76,201,240,0.15)" }} />
                <div className="font-mono" style={{ fontSize: 11, color: "#FFB86C", marginBottom: 4 }}>{t.tag} · {t.period}</div>
                <div className="font-display" style={{ fontSize: 15.5, fontWeight: 600 }}>{t.title}</div>
                {t.desc && <p style={{ color: "#AEB3BE", fontSize: 13.5, marginTop: 6, lineHeight: 1.6, maxWidth: 620 }}>{t.desc}</p>}
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={100}>
          <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 18 }}>
            <div style={{ border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 18, background: "#12151B" }}>
              <div className="font-display" style={{ fontWeight: 700, marginBottom: 8, fontSize: 14 }}>Certifications</div>
              {CERTS.map((c) => <p key={c} style={{ fontSize: 12.5, color: "#AEB3BE", marginBottom: 6, lineHeight: 1.5 }}>{c}</p>)}
            </div>
            <div style={{ border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 18, background: "#12151B" }}>
              <div className="font-display" style={{ fontWeight: 700, marginBottom: 8, fontSize: 14 }}>Achievements</div>
              {ACHIEVEMENTS.map((a) => <p key={a} style={{ fontSize: 12.5, color: "#AEB3BE", marginBottom: 6, lineHeight: 1.5 }}>{a}</p>)}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ---------------- CONTACT ---------------- */}
      <section id="contact" style={{ padding: "60px 24px 100px", maxWidth: 700, margin: "0 auto" }}>
        <Reveal><Eyebrow n="04" label="Reach out" /></Reveal>
        <Reveal delay={80}><h2 className="font-display" style={{ fontSize: "clamp(1.6rem,3vw,2.2rem)", marginBottom: 10 }}>Let's build something</h2></Reveal>
        <Reveal delay={120}>
          <p style={{ color: "#AEB3BE", fontSize: 14, marginBottom: 30 }}>
            Messages submitted here are saved to persistent storage tied to this portfolio — see the implementation guide below for how it works.
          </p>
        </Reveal>

        <Reveal delay={160}>
          <form onSubmit={submit} style={{ display: "grid", gap: 14 }}>
            <input required placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={{ background: "#12151B", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, padding: "12px 14px", color: "#E7E9EE", fontSize: 14 }} />
            <input required type="email" placeholder="Your email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              style={{ background: "#12151B", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, padding: "12px 14px", color: "#E7E9EE", fontSize: 14 }} />
            <textarea required placeholder="Message" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
              style={{ background: "#12151B", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, padding: "12px 14px", color: "#E7E9EE", fontSize: 14, resize: "vertical" }} />
            <button type="submit" disabled={status === "saving"} className="btn-send" style={{ background: "#4CC9F0", color: "#0E1015", border: "none", padding: "13px", borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              {status === "saving" ? <><Loader2 size={16} className="cursor-blink" /> Saving...</> : status === "done" ? <><CheckCircle2 size={16} /> Sent</> : <><Send size={15} /> Send message</>}
            </button>
            {status === "error" && <p style={{ color: "#FF6B6B", fontSize: 12.5 }}>Something went wrong — please try again.</p>}
          </form>
        </Reveal>

        <Reveal delay={200}>
          <div style={{ display: "flex", gap: 18, marginTop: 34, flexWrap: "wrap", fontSize: 13, color: "#AEB3BE" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Mail size={14} /> puneethpenke015@gmail.com</span>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Phone size={14} /> 7013858252</span>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}><MapPin size={14} /> Ongole, Andhra Pradesh</span>
          </div>
          <div style={{ display: "flex", gap: 14, marginTop: 16 }}>
            <a href="https://www.linkedin.com/in/puneeth-kumar2004" target="_blank" rel="noreferrer" style={{ color: "#4CC9F0" }}><Linkedin size={20} /></a>
            <a href="https://github.com/puneethkumarpenke" target="_blank" rel="noreferrer" style={{ color: "#4CC9F0" }}><Github size={20} /></a>
          </div>
        </Reveal>
      </section>

      {/* ---------------- FOOTER / ADMIN ---------------- */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "22px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: 1100, margin: "0 auto" }}>
        <span className="font-mono" style={{ fontSize: 11, color: "#5A606B" }}>© 2026 {FULL_NAME}</span>
        <button onClick={() => setAdminOpen(true)} style={{ background: "none", border: "none", color: "#5A606B", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 11 }} className="font-mono">
          <Lock size={12} /> admin
        </button>
      </footer>

      {/* ---------------- ADMIN MODAL ---------------- */}
      {adminOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 20 }}>
          <div style={{ background: "#14171D", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: 24, width: "100%", maxWidth: 480, maxHeight: "80vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span className="font-display" style={{ fontWeight: 700 }}>Inbox</span>
              <button onClick={() => { setAdminOpen(false); setAuthed(false); setPass(""); }} style={{ background: "none", border: "none", color: "#AEB3BE", cursor: "pointer" }}><X size={18} /></button>
            </div>
            {!authed ? (
              <div>
                <p style={{ fontSize: 12.5, color: "#AEB3BE", marginBottom: 12 }}>Enter passcode to view messages (default: <span className="font-mono">puneeth2026</span> — change this in the code).</p>
                <div style={{ display: "flex", gap: 8 }}>
                  <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="Passcode"
                    style={{ flex: 1, background: "#0E1015", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, padding: "10px 12px", color: "#E7E9EE", fontSize: 13 }} />
                  <button onClick={() => setAuthed(pass === "puneeth2026")} style={{ background: "#4CC9F0", color: "#0E1015", border: "none", borderRadius: 8, padding: "0 16px", fontWeight: 600, cursor: "pointer" }}>Go</button>
                </div>
              </div>
            ) : loadingMsgs ? (
              <p style={{ color: "#AEB3BE", fontSize: 13 }}>Loading...</p>
            ) : messages.length === 0 ? (
              <p style={{ color: "#AEB3BE", fontSize: 13 }}>No messages yet.</p>
            ) : (
              <div style={{ display: "grid", gap: 12 }}>
                {messages.map((m, i) => (
                  <div key={i} style={{ border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                      <span style={{ fontWeight: 600 }}>{m.name}</span>
                      <span className="font-mono" style={{ color: "#5A606B" }}>{new Date(m.date).toLocaleString()}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "#4CC9F0", marginTop: 2 }}>{m.email}</div>
                    <p style={{ fontSize: 13, color: "#C7CBD4", marginTop: 8, lineHeight: 1.5 }}>{m.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Eyebrow({ n, label }) {
  return (
    <div className="font-mono" style={{ fontSize: 12, color: "#4CC9F0", letterSpacing: 2, marginBottom: 10 }}>
      {n} — {label.toUpperCase()}
    </div>
  );
}
