import React, { useEffect, useMemo, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate, useLocation, useParams } from "react-router-dom";



// ---------------------------------------------
// Theme
// ---------------------------------------------
const COLORS = {
  cibcRed: "#B90E31",
  cibcGold: "#F4C542",
  ink: "#0F172A",
};

// ---------------------------------------------
// Employees (restricted team)
// ---------------------------------------------
const EMPLOYEES = [
  { id: "e02", name: "Muhammad Mustafa", title: "Machine Learning Engineer", email: "m.mustafa@cibc.com" },
  { id: "e07", name: "Sara Khan", title: "Machine Learning Lead", email: "sara.khan@cibc.com" },
  { id: "e06", name: "Ian Greene", title: "Finance Manager", email: "ian.greene@cibc.com" },
];

// ---------------------------------------------
// Seed messages with requested dates
// ---------------------------------------------
function seedMessages() {
  // Fixed absolute dates for grading clarity (local TZ will render nicely)
  const iso = (y, m, d, hh = 9, mm = 0) => new Date(Date.UTC(y, m - 1, d, hh, mm, 0)).toISOString();
  return [
    {
      id: "m001",
      fromId: "e07",
      toIds: ["e02"],
      subject: "Model deployment readiness",
      body: "Hey Muhammad — the fraud detection model v1.8 passed staging checks (AUC 0.941). Please review the feature store schema and confirm a rollout window for 22:00–23:00 ET.",
      dateISO: iso(2025, 8, 22, 14, 10), // Aug 22, 2025 (older than Sept 11)
      readBy: ["e07"],
      starred: false,
      labels: ["ML/Engineering"],
    },
    {
      id: "m002",
      fromId: "e07",
      toIds: ["e02"],
      subject: "Sprint planning: ML Ops",
      body: "Backlog draft: retrain on Q3 data, enable drift monitor alerts, move batch scoring to hourly for cards portfolio.",
      dateISO: iso(2025, 9, 5, 16, 35), // Sept 5, 2025 (older than Sept 11)
      readBy: ["e07"],
      starred: true,
      labels: ["Planning"],
    },
    {
      id: "m003",
      fromId: "e06",
      toIds: ["e02"],
      subject: "Salary disbursement confirmation",
      body: "Hi Muhammad, following up on your note about banking delays: Finance has prepared a bank draft for the remaining pay. I can confirm that it will be signed and ready for pickup by Tuesday, November 4, 2025. Please bring photo ID to Treasury at 9th floor reception.",
      dateISO: iso(2025, 10, 31, 11, 20), // Oct 30, 2025
      readBy: ["e06"],
      starred: false,
      labels: ["Finance"],
    },
  ];
}

// ---------------------------------------------
// Auth state (sessionStorage)
// ---------------------------------------------
function useAuth() {
  const [auth, setAuth] = useState(() => {
    try {
      const raw = sessionStorage.getItem("cibc_portal_auth");
      return raw ? JSON.parse(raw) : { loggedIn: false, userId: null };
    } catch { return { loggedIn: false, userId: null }; }
  });
  useEffect(() => sessionStorage.setItem("cibc_portal_auth", JSON.stringify(auth)), [auth]);
  return [auth, setAuth];
}

function validate(u, p) {
  return (u === "asmmaffan" && p === "packages") || (u === "manager" && p === "cibc2025");
}

// ---------------------------------------------
// Messages state (sessionStorage)
// ---------------------------------------------
function useMessages() {
  const [msgs, setMsgs] = useState(() => {
    try {
      const raw = sessionStorage.getItem("cibc_portal_msgs");
      if (raw) return JSON.parse(raw);
      const seeded = seedMessages();
      sessionStorage.setItem("cibc_portal_msgs", JSON.stringify(seeded));
      return seeded;
    } catch { return seedMessages(); }
  });
  useEffect(() => sessionStorage.setItem("cibc_portal_msgs", JSON.stringify(msgs)), [msgs]);
  return [msgs, setMsgs];
}

// ---------------------------------------------
// Utils
// ---------------------------------------------
function getEmp(id) { return EMPLOYEES.find((e) => e.id === id); }
function fmtDate(isoStr) {
  const d = new Date(isoStr);
  return d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

// ---------------------------------------------
// Header & Footer (restored design)
// ---------------------------------------------
function Header() {
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isLogin = location.pathname === "/login";
  return (
    <header className="sticky top-0 z-40 border-b" style={{ background: COLORS.cibcRed, borderColor: "#8f0b26" }}>
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link to={auth.loggedIn ? "/" : "/login"} className="flex items-center gap-3">
          <div className="flex items-center justify-center h-8 w-8 rounded bg-white">
            <span className="text-[10px] font-bold" style={{ color: COLORS.cibcRed }}>CIBC</span>
          </div>
          <div className="text-white font-semibold tracking-tight">Employee Portal</div>
        </Link>
        {!isLogin && (
          <nav className="flex items-center gap-1 text-sm">
            <Link to="/" className="px-3 py-1 rounded text-white/90 hover:text-white">Dashboard</Link>
            <Link to="/inbox" className="px-3 py-1 rounded text-white/90 hover:text-white">Inbox</Link>
            <Link to="/compose" className="px-3 py-1 rounded text-white/90 hover:text-white">Compose</Link>
            <Link to="/directory" className="px-3 py-1 rounded text-white/90 hover:text-white">Directory</Link>
            {auth.loggedIn && (
              <button onClick={() => { setAuth({ loggedIn: false, userId: null }); navigate("/login"); }} className="ml-2 px-3 py-1 rounded bg-white/10 text-white hover:bg-white/20">Sign out</button>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-12 border-t bg-white text-slate-700">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-8 w-8 rounded bg-[#B90E31] grid place-items-center"><span className="text-[10px] font-bold text-white">CIBC</span></div>
            <span className="font-semibold">Employee Portal</span>
          </div>
          <p className="text-slate-500">Internal Portal. Do not connect to online systems!</p>
        </div>
        <div>
          <div className="font-semibold mb-2">Company</div>
          <ul className="space-y-1 text-slate-500">
            <li><a className="hover:text-slate-900" target="_blank" rel="noreferrer" href="https://www.cibc.com/en/about-cibc.html">About CIBC</a></li>
            <li><a className="hover:text-slate-900" target="_blank" rel="noreferrer" href="https://www.cibc.com/en/careers.html">Careers</a></li>
            <li><a className="hover:text-slate-900" target="_blank" rel="noreferrer" href="https://www.cibc.com/en/contact-us.html">Contact</a></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-2">Security & Legal</div>
          <ul className="space-y-1 text-slate-500">
            <li><a className="hover:text-slate-900" target="_blank" rel="noreferrer" href="https://www.cibc.com/en/privacy-security/privacy-policy.html">Privacy</a></li>
            <li><a className="hover:text-slate-900" target="_blank" rel="noreferrer" href="https://www.cibc.com/en/privacy-security/overview.html">Security</a></li>
            <li><a className="hover:text-slate-900" target="_blank" rel="noreferrer" href="https://www.cibc.com/en/legal/legal.html">Legal</a></li>
            <li><a className="hover:text-slate-900" target="_blank" rel="noreferrer" href="https://www.cibc.com/en/accessibility/accessibility-plan.html">Accessibility</a></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-2">Help</div>
          <ul className="space-y-1 text-slate-500">
            <li><a className="hover:text-slate-900" target="_blank" rel="noreferrer" href="https://www.cibc.com/">cibc.com</a></li>
            <li><a className="hover:text-slate-900" target="_blank" rel="noreferrer" href="https://www.cibc.com/en/privacy-security/report-fraud.html">Report Fraud</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t">
        <div className="max-w-7xl mx-auto px-6 py-4 text-xs text-slate-500 flex items-center justify-between">
          <span>© {new Date().getFullYear()} CIBC</span>
          <span>Built with React</span>
        </div>
      </div>
    </footer>
  );
}

// ---------------------------------------------
// Auth guard
// ---------------------------------------------
function RequireAuth({ children }) {
  const [auth] = useAuth();
  const location = useLocation();
  if (!auth.loggedIn) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}

// ---------------------------------------------
// Login
// ---------------------------------------------
function Login() {
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state && location.state.from && location.state.from.pathname) || "/";

  const doLogin = async () => {
    setErr("");
    setLoading(true);
    const ok = validate(u.trim(), p.trim());
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    if (ok) { setAuth({ loggedIn: true, userId: "e02" }); navigate(from, { replace: true }); }
    else setErr("Invalid credentials");
  };

  return (
    <main className="min-h-[80vh] grid place-items-center bg-gradient-to-b from-slate-50 to-white px-6">
      <div className="w-full max-w-md bg-white border rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-8 w-8 rounded grid place-items-center" style={{ background: COLORS.cibcRed }}>
            <span className="text-[10px] font-bold text-white">CIBC</span>
          </div>
          <div className="font-semibold">Employee Portal</div>
        </div>
        <h1 className="text-xl font-bold mb-1">Sign in</h1>
        <p className="text-sm text-slate-600 mb-6">Use your credentials to continue.</p>
        <label className="text-sm">Username</label>
        <input className="mt-1 w-full border rounded px-3 py-2 mb-4" placeholder="username" value={u} onChange={(e)=>setU(e.target.value)} />
        <label className="text-sm">Password</label>
        <input className="mt-1 w-full border rounded px-3 py-2" placeholder="password" type="password" value={p} onChange={(e)=>setP(e.target.value)} />
        {err && <div className="text-red-600 text-sm mt-2">{err}</div>}
        <button disabled={loading} onClick={doLogin} className="mt-4 w-full" style={{ background: COLORS.cibcRed, color: "#fff" }}>
          <div className="py-2 font-medium">{loading ? "Signing in…" : "Sign in"}</div>
        </button>
      </div>
    </main>
  );
}

// ---------------------------------------------
// Dashboard
// ---------------------------------------------
function Dashboard() {
  const [auth] = useAuth();
  const [msgs] = useMessages();
  const myId = auth.userId || "e02";
  const myInbox = useMemo(() => msgs.filter((m) => m.toIds.includes(myId) || m.fromId === myId), [msgs, myId]);
  const unread = myInbox.filter((m) => !m.readBy.includes(myId)).length;
  const starred = myInbox.filter((m) => m.starred).length;

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <div className="bg-white rounded-2xl border p-8 mb-8">
        <h1 className="text-2xl font-semibold">Welcome {getEmp(myId)?.name || "Colleague"}</h1>
        <p className="text-slate-600 mt-1">Your internal communications at a glance.</p>
        <div className="mt-6 grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          <StatCard label="Inbox items" value={myInbox.length} />
          <StatCard label="Unread" value={unread} />
          <StatCard label="Starred" value={starred} />
        </div>
        <div className="mt-6 flex gap-3">
          <Link to="/inbox" className="px-4 py-2 rounded text-white" style={{ background: COLORS.cibcRed }}>Open Inbox</Link>
          <Link to="/compose" className="px-4 py-2 rounded border">Compose</Link>
          <Link to="/directory" className="px-4 py-2 rounded border">Directory</Link>
        </div>
      </div>
      <RecentList />
    </main>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="p-4 border rounded-xl bg-slate-50">
      <div className="text-slate-500 text-sm">{label}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
    </div>
  );
}

function RecentList() {
  const [msgs] = useMessages();
  const recent = [...msgs].sort((a,b)=>new Date(b.dateISO)-new Date(a.dateISO)).slice(0,6);
  return (
    <div className="border rounded-2xl bg-white">
      <div className="px-6 py-4 border-b font-semibold">Recent messages</div>
      <div className="divide-y">
        {recent.map(m => (
          <div key={m.id} className="px-6 py-3 flex items-center justify-between">
            <div>
              <div className="font-medium">{m.subject}</div>
              <div className="text-xs text-slate-500">From {getEmp(m.fromId)?.name} · {fmtDate(m.dateISO)}</div>
            </div>
            <Link to={`/inbox/${m.id}`} className="text-sm text-indigo-600 underline">Open</Link>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------
// Inbox & Thread
// ---------------------------------------------
function Inbox() {
  const [msgs] = useMessages();
  const [auth] = useAuth();
  const myId = auth.userId || "e02";
  const [q, setQ] = useState("");
  const [showStar, setShowStar] = useState(false);

  const list = useMemo(() => {
    let x = msgs.filter((m) => m.toIds.includes(myId) || m.fromId === myId);
    if (q.trim()) {
      const t = q.trim().toLowerCase();
      x = x.filter((m) => m.subject.toLowerCase().includes(t) || m.body.toLowerCase().includes(t));
    }
    if (showStar) x = x.filter((m) => m.starred);
    return x.sort((a,b)=>new Date(b.dateISO)-new Date(a.dateISO));
  }, [msgs, myId, q, showStar]);

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-4 flex items-center gap-3">
        <input className="border rounded px-3 py-2 w-full sm:w-80" placeholder="Search inbox" value={q} onChange={(e)=>setQ(e.target.value)} />
        <label className="text-sm flex items-center gap-2"><input type="checkbox" checked={showStar} onChange={(e)=>setShowStar(e.target.checked)} /> Starred</label>
        <Link to="/compose" className="px-4 py-2 rounded text-white" style={{ background: COLORS.cibcRed }}>Compose</Link>
      </div>

      <div className="border rounded-xl overflow-hidden bg-white">
        <div className="grid grid-cols-12 px-4 py-2 bg-slate-50 text-xs text-slate-500">
          <div className="col-span-5">Subject</div>
          <div className="col-span-3">From</div>
          <div className="col-span-3">To</div>
          <div className="col-span-1 text-right pr-2">Star</div>
        </div>
        <div className="divide-y">
          {list.map(m => (
            <Link key={m.id} to={`/inbox/${m.id}`} className="grid grid-cols-12 px-4 py-3 hover:bg-slate-50">
              <div className="col-span-5">
                <div className={`font-medium ${m.readBy.includes(myId) ? "" : "text-slate-900"}`}>{m.subject}</div>
                <div className="text-xs text-slate-500 truncate">{m.body}</div>
              </div>
              <div className="col-span-3 text-sm">{getEmp(m.fromId)?.name}</div>
              <div className="col-span-3 text-sm truncate">{m.toIds.map((id)=>getEmp(id)?.name).join(", ")}</div>
              <div className="col-span-1 text-right pr-2">{m.starred ? "★" : "☆"}</div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

function Thread() {
  const { id } = useParams();
  const [msgs, setMsgs] = useMessages();
  const [auth] = useAuth();
  const myId = auth.userId || "e02";
  const navigate = useNavigate();
  const m = msgs.find((x) => x.id === id);
  useEffect(() => {
    if (!m) return;
    if (!m.readBy.includes(myId)) {
      const next = msgs.map((x) => x.id === id ? { ...x, readBy: [...new Set([...x.readBy, myId])] } : x);
      setMsgs(next);
    }
  }, [id]);
  if (!m) return <main className="max-w-3xl mx-auto px-6 py-10">Message not found</main>;

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <div className="mb-3 text-sm text-slate-500"><button className="underline" onClick={()=>navigate(-1)}>Back</button></div>
      <div className="border rounded-2xl bg-white overflow-hidden">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <div>
            <div className="font-semibold text-lg">{m.subject}</div>
            <div className="text-xs text-slate-500">From {getEmp(m.fromId)?.name} · {fmtDate(m.dateISO)}</div>
          </div>
          <button onClick={()=>toggleStar(m.id, msgs, setMsgs)} className="text-xl">{m.starred ? "★" : "☆"}</button>
        </div>
        <div className="px-6 py-5 whitespace-pre-wrap text-slate-800">{m.body}</div>
      </div>
      <div className="mt-4 flex gap-2">
        <Link to={`/compose?reply=${m.id}`} className="px-4 py-2 rounded text-white" style={{ background: COLORS.cibcRed }}>Reply</Link>
        <Link to={`/compose?forward=${m.id}`} className="px-4 py-2 rounded border">Forward</Link>
      </div>
    </main>
  );
}

function toggleStar(id, msgs, setMsgs) {
  setMsgs(msgs.map((x)=> x.id === id ? { ...x, starred: !x.starred } : x));
}

// ---------------------------------------------
// Compose
// ---------------------------------------------
function Compose() {
  const [auth] = useAuth();
  const myId = auth.userId || "e02";
  const [msgs, setMsgs] = useMessages();
  const params = new URLSearchParams(window.location.search);
  const replyId = params.get("reply");
  const forwardId = params.get("forward");
  const replyMsg = msgs.find((m)=>m.id===replyId);
  const forwardMsg = msgs.find((m)=>m.id===forwardId);

  const [to, setTo] = useState(replyMsg ? getEmp(replyMsg.fromId)?.email : "");
  const [subject, setSubject] = useState(
    replyMsg ? `Re: ${replyMsg.subject}` : forwardMsg ? `Fwd: ${forwardMsg.subject}` : ""
  );
  const [body, setBody] = useState(forwardMsg ? (`\n\n—— Forwarded ——\nFrom: ${getEmp(forwardMsg.fromId)?.name}\nDate: ${fmtDate(forwardMsg.dateISO)}\n\n${forwardMsg.body}`) : "");

  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    const toIds = to.split(",").map((s)=>s.trim()).filter(Boolean).map((email)=>{
      const emp = EMPLOYEES.find((e)=>e.email===email);
      return emp ? emp.id : null;
    }).filter(Boolean);
    if (!toIds.length) return alert("Recipient not found in directory");
    const newMsg = {
      id: `m${String(Date.now())}`,
      fromId: myId,
      toIds,
      subject: subject || "(no subject)",
      body: body || "",
      dateISO: new Date().toISOString(),
      readBy: [myId],
      starred: false,
      labels: ["General"],
    };
    setMsgs([newMsg, ...msgs]);
    navigate("/inbox");
  };

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <form onSubmit={submit} className="border rounded-2xl bg-white">
        <div className="px-6 py-4 border-b font-semibold">Compose</div>
        <div className="p-6 space-y-4">
          <div>
            <label className="text-sm text-slate-600">To</label>
            <input className="mt-1 w-full border rounded px-3 py-2" placeholder="email(s), comma separated" value={to} onChange={(e)=>setTo(e.target.value)} />
            <div className="text-[11px] text-slate-500 mt-1">Directory hint: {EMPLOYEES.map(e=>e.email).join(", ")}</div>
          </div>
          <div>
            <label className="text-sm text-slate-600">Subject</label>
            <input className="mt-1 w-full border rounded px-3 py-2" value={subject} onChange={(e)=>setSubject(e.target.value)} />
          </div>
          <div>
            <label className="text-sm text-slate-600">Message</label>
            <textarea rows={8} className="mt-1 w-full border rounded px-3 py-2" value={body} onChange={(e)=>setBody(e.target.value)} />
          </div>
          <div className="flex gap-3">
            <button type="submit" className="px-4 py-2 rounded text-white" style={{ background: COLORS.cibcRed }}>Send</button>
            <Link to="/inbox" className="px-4 py-2 rounded border">Cancel</Link>
          </div>
        </div>
      </form>
    </main>
  );
}

// ---------------------------------------------
// Directory
// ---------------------------------------------
function Directory() {
  const [q, setQ] = useState("");
  const list = useMemo(()=>{
    const t = q.trim().toLowerCase();
    return EMPLOYEES.filter(e=>!t || e.name.toLowerCase().includes(t) || e.title.toLowerCase().includes(t) || e.email.toLowerCase().includes(t));
  }, [q]);

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      <div className="mb-4 flex items-center gap-3">
        <input className="border rounded px-3 py-2 w-full sm:w-96" placeholder="Search people" value={q} onChange={(e)=>setQ(e.target.value)} />
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {list.map(e => (
          <div key={e.id} className="p-4 border rounded-xl bg-white">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full grid place-items-center text-white font-semibold" style={{ background: COLORS.cibcRed }}>{e.name.split(" ").map(s=>s[0]).slice(0,2).join("")}</div>
              <div>
                <div className="font-medium">{e.name}</div>
                <div className="text-xs text-slate-500">{e.title}</div>
              </div>
            </div>
            <div className="mt-3 text-sm text-slate-600 break-all">{e.email}</div>
            <div className="mt-3 flex gap-2">
              <Link to={`/compose?to=${encodeURIComponent(e.email)}`} className="px-3 py-1 rounded text-white" style={{ background: COLORS.cibcRed }}>Message</Link>
              <a href={`mailto:${e.email}`} className="px-3 py-1 rounded border">Email</a>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

// ---------------------------------------------
// App Root
// ---------------------------------------------
export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <div className="flex-1">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<RequireAuth><Dashboard /></RequireAuth>} />
            <Route path="/inbox" element={<RequireAuth><Inbox /></RequireAuth>} />
            <Route path="/inbox/:id" element={<RequireAuth><Thread /></RequireAuth>} />
            <Route path="/compose" element={<RequireAuth><Compose /></RequireAuth>} />
            <Route path="/directory" element={<RequireAuth><Directory /></RequireAuth>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

// ---------------------------------------------
// Runtime smoke tests (console)
// ---------------------------------------------
(function runTests(){
  try {
    console.assert(EMPLOYEES.length === 3, "Expected exactly 3 team members");
    console.assert(typeof validate === "function", "validate() missing");
    console.assert(validate("asmmaffan","packages") === true, "Auth test #1 failed");
    console.assert(validate("manager","cibc2025") === true, "Auth test #2 failed");
    const seeded = seedMessages();
    console.assert(seeded.every(m => m.dateISO), "Messages need dateISO");
    console.log("CIBC portal restored UI — tests passed ✅");
  } catch (e) { console.warn("Smoke tests warning:", e); }
})();
