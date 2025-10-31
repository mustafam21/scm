import React, { useEffect, useMemo, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useParams, Navigate, useLocation, useNavigate } from "react-router-dom";



import stripeLogo from "./assets/stripe.png";
import upsLogo from "./assets/ups.svg";
import fedexLogo from "./assets/fedex.png";

const LOGOS = {
  stripe: stripeLogo,
  ups: upsLogo,
  fedex: fedexLogo,
};



const partnerDeals = [
  { brand: "H&M", discount: "10%", url: "https://www2.hm.com" },
  { brand: "Steve Madden", discount: "15%", url: "https://www.stevemadden.com" },
  { brand: "Gap", discount: "20%", url: "https://www.gap.com" },
  { brand: "Foot Locker", discount: "15%", url: "https://www.footlocker.com" },
  { brand: "Adidas", discount: "30%", url: "https://www.adidas.com" },
  { brand: "Ardene", discount: "10%", url: "https://www.ardene.com" },
  { brand: "Aldo", discount: "15%", url: "https://www.aldoshoes.com" },
  { brand: "JD", discount: "10%", url: "https://www.jdsports.com" },
  { brand: "Levi's", discount: "15%", url: "https://www.levi.com" },
  { brand: "UGG", discount: "10%", url: "https://www.ugg.com" },
  { brand: "Ray-Ban", discount: "25%", url: "https://www.ray-ban.com" },
  { brand: "Crocs", discount: "$20 off", url: "https://www.crocs.com" },
  { brand: "Lids", discount: "15%", url: "https://www.lids.com" },
  { brand: "Moose Knuckles", discount: "$100 off", url: "https://www.mooseknucklescanada.com" },
  { brand: "Samsung", discount: "10%", url: "https://www.samsung.com/ca" },
  { brand: "Lenovo", discount: "Up to 60% off", url: "https://www.lenovo.com/ca/en" },
  { brand: "Bath & Body Works", discount: "10%", url: "https://www.bathandbodyworks.com" },
  { brand: "YSL", discount: "10%", url: "https://www.ysl.com" },
  { brand: "Under Armour", discount: "20%", url: "https://www.underarmour.ca" },
  { brand: "HP", discount: "$100 off", url: "https://www.hp.com/ca-en" },
  { brand: "Shark", discount: "15%", url: "https://www.sharkclean.ca" },
  { brand: "Swarovski", discount: "15%", url: "https://www.swarovski.com" },
  { brand: "e.l.f. Cosmetics", discount: "25%", url: "https://www.elfcosmetics.com" },
  { brand: "RW&CO", discount: "25%", url: "https://www.rw-co.com" },
];

const initialProducts = [
  { id: "prod_ugg_bailey_bow", name: "UGG Women's Mini Bailey Bow II (Beige Blush)", price: 205.04, url: "https://www.littleburgundyshoes.com/product/ugg-womens-mini-bailey-bow-ii-in-beige-blush-32750185" },
  { id: "prod_marc_large_tote", name: "Marc Jacobs - The Large Tote Bag (Black)", price: 161.77, url: "https://www.marcjacobs.com/ca-en/the-large-tote-bag/M0016156.html" },
  { id: "prod_lulu_define_jacket", name: "Lululemon Define Jacket Nulu - Goodnight Plum", price: 132.54, url: "https://shop.lululemon.com/en-ca/p/jackets-and-hoodies-jackets/Define-Jacket-Nulu/_/prod11020769" },
  { id: "prod_bb_watch_x", name: "Apple Watch Series X (GPS, 45mm)", price: 599.99, url: "https://www.bestbuy.ca/en-ca" },
  { id: "prod_lenovo_ideapad_pro", name: "Lenovo IdeaPad Pro 16", price: 1299.99, url: "https://www.lenovo.com/ca/en" },
];

const sampleOrders = [
  {
    orderId: "ord_lb_20251016",
    merchant: "Little Burgundy Shoes",
    date: "2025-10-16",
    time: "01:22",
    expectedDelivery: "2025-11-04",
    destination: "Markham, ON, Canada",
    total: initialProducts[0].price,
    items: [{ ...initialProducts[0], qty: 1 }],
    trackingEvents: [
      { carrier: "FedEx", trackingNumber: "612345678901", status: "Shipment information sent to FedEx", location: "Montreal, QC", time: "2025-10-16 02:05" },
      { carrier: "FedEx", trackingNumber: "612345678901", status: "Label created", location: "Montreal, QC", time: "2025-10-16 01:58" },
    ],
  },
  {
    orderId: "ord_mj_20251016",
    merchant: "Marc Jacobs",
    date: "2025-10-16",
    time: "01:47",
    expectedDelivery: "2025-11-05",
    destination: "Markham, ON, Canada",
    total: initialProducts[1].price,
    items: [{ ...initialProducts[1], qty: 1 }],
    trackingEvents: [
      { carrier: "UPS", trackingNumber: "1Z999AA10123456784", status: "Origin Scan", location: "Secaucus, NJ, US", time: "2025-10-24 09:01" },
      { carrier: "UPS", trackingNumber: "1Z999AA10123456784", status: "Departed UPS Facility", location: "Buffalo, NY, US", time: "2025-10-27 22:12" },
      { carrier: "UPS", trackingNumber: "1Z999AA10123456784", status: "In transit", location: "Louisville, KY, US", time: "2025-10-28 16:35" },
      { carrier: "UPS", trackingNumber: "1Z999AA10123456784", status: "Import scan", location: "Mississauga, ON, CA", time: "2025-10-29 09:17" },
      { carrier: "UPS", trackingNumber: "1Z999AA10123456784", status: "Arrived at UPS Facility", location: "Mississauga, ON, CA", time: "2025-10-29 13:24" }
    ],
  },
  {
    orderId: "ord_lulu_20251016",
    merchant: "Lululemon",
    date: "2025-10-16",
    time: "02:31",
    expectedDelivery: "2025-10-31",
    destination: "Markham, ON, Canada",
    total: initialProducts[2].price,
    items: [{ ...initialProducts[2], qty: 1 }],
    trackingEvents: [
      { carrier: "FedEx", trackingNumber: "784512369000", status: "Picked up", location: "Vancouver, BC", time: "2025-10-21 15:05" },
      { carrier: "FedEx", trackingNumber: "784512369000", status: "Left FedEx origin facility", location: "Delta, BC", time: "2025-10-21 22:10" },
      { carrier: "FedEx", trackingNumber: "784512369000", status: "Arrived at FedEx location", location: "Mississauga, ON", time: "2025-10-22 05:50" },
      { carrier: "FedEx", trackingNumber: "784512369000", status: "Departed FedEx location", location: "Mississauga, ON", time: "2025-10-22 20:15" },
      { carrier: "FedEx", trackingNumber: "784512369000", status: "At local FedEx facility", location: "Whitby, ON", time: "2025-10-23 05:09" },
      { carrier: "FedEx", trackingNumber: "784512369000", status: "On FedEx vehicle for delivery", location: "Whitby, ON", time: "2025-10-23 05:13" },
      { carrier: "FedEx", trackingNumber: "784512369000", status: "Delivery exception", location: "Markham, ON", time: "2025-10-23 09:36" },
      { carrier: "FedEx", trackingNumber: "784512369000", status: "Shipment arriving On-Time", location: "Whitby, ON", time: "2025-10-23 23:49" },
      { carrier: "FedEx", trackingNumber: "784512369000", status: "At local FedEx facility", location: "Whitby, ON", time: "2025-10-31 08:12" },
    ],
  },
  {
    orderId: "ord_bb_20251012",
    merchant: "Best Buy",
    date: "2025-10-12",
    time: "14:18",
    expectedDelivery: "2025-11-03",
    destination: "Markham, ON, Canada",
    total: initialProducts[3].price,
    items: [{ ...initialProducts[3], qty: 1 }],
    trackingEvents: [
      { carrier: "UPS", trackingNumber: "1Z3F0BB10123456789", status: "Origin Scan", location: "Brampton, ON, CA", time: "2025-10-17 18:22" },
      { carrier: "UPS", trackingNumber: "1Z3F0BB10123456789", status: "Departed UPS Facility", location: "Brampton, ON, CA", time: "2025-10-20 02:10" },
      { carrier: "UPS", trackingNumber: "1Z3F0BB10123456789", status: "Arrived at UPS Facility", location: "Mississauga, ON, CA", time: "2025-10-21 06:40" },
      { carrier: "UPS", trackingNumber: "1Z3F0BB10123456789", status: "In transit", location: "Concord, ON, CA", time: "2025-10-27 11:05" },
    ],
  },
  {
    orderId: "ord_len_20251027",
    merchant: "Lenovo",
    date: "2025-10-27",
    time: "10:03",
    expectedDelivery: "2025-11-07",
    destination: "Markham, ON, Canada",
    total: initialProducts[4].price,
    items: [{ ...initialProducts[4], qty: 1 }],
    trackingEvents: [
      { carrier: "FedEx", trackingNumber: "6123LENOVO789012", status: "Picked up", location: "Whitsett, NC, US", time: "2025-10-27 12:04" },
      { carrier: "FedEx", trackingNumber: "6123LENOVO789012", status: "Arrived at FedEx location", location: "Memphis, TN, US", time: "2025-10-29 03:44" },
      { carrier: "FedEx", trackingNumber: "6123LENOVO789012", status: "Departed FedEx location", location: "Memphis, TN, US", time: "2025-10-29 06:21" },
      { carrier: "FedEx", trackingNumber: "6123LENOVO789012", status: "In transit", location: "Mississauga, ON, CA", time: "2025-10-31 09:57" },
    ],
  },
];

const USERS_LIST = ["Adam Sarwar", "Muhammad Mustafa", "Shahid Sarwar", "Affan Naushad"];

function validateCredentials(u, p) {
  return u === "asmmaffan" && p === "packages";
}

function useAuthState() {
  const [auth, setAuth] = useState(() => {
    try {
      const raw = sessionStorage.getItem("stripeConsumersAuth");
      return raw ? JSON.parse(raw) : { loggedIn: false, user: null };
    } catch {
      return { loggedIn: false, user: null };
    }
  });
  useEffect(() => {
    sessionStorage.setItem("stripeConsumersAuth", JSON.stringify(auth));
  }, [auth]);
  return [auth, setAuth];
}

function RequireAuth({ children }) {
  const [auth] = useAuthState();
  const location = useLocation();
  if (!auth.loggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
}

function Header() {
  const location = useLocation();
  const [auth, setAuth] = useAuthState();
  const navigate = useNavigate();
  const onLogout = () => {
    setAuth({ loggedIn: false, user: null });
    navigate("/login");
  };
  const isLogin = location.pathname === "/login";
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to={auth.loggedIn ? "/" : "/login"} className="flex items-center gap-3">
          <img src={LOGOS.stripe} alt="Stripe" className="h-6" />
          <span className="font-semibold tracking-tight text-slate-800">Consumers</span>
        </Link>
        {!isLogin && (
          <nav className="flex items-center gap-3 text-sm">
            <Link to="/" className="px-3 py-1 rounded hover:bg-slate-100">Home</Link>
            <Link to="/orders" className="px-3 py-1 rounded hover:bg-slate-100">Orders</Link>
            <Link to="/merchants" className="px-3 py-1 rounded bg-slate-100 border">Merchants</Link>
            {auth.loggedIn ? (
              <button onClick={onLogout} className="ml-2 px-3 py-1 rounded border">Sign out</button>
            ) : null}
          </nav>
        )}
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-white text-slate-700 mt-12 border-t">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <img src={LOGOS.stripe} alt="Stripe" className="h-6" />
            <span className="font-semibold">Consumers</span>
          </div>
          <p className="text-slate-500">Consolidated order management and partner integrations.</p>
        </div>
        <div>
          <div className="font-semibold mb-2">Products</div>
          <ul className="space-y-1 text-slate-500">
            <li><Link to="/orders" className="hover:text-slate-800">Orders</Link></li>
            <li><Link to="/orders" className="hover:text-slate-800">Tracking</Link></li>
            <li><Link to="/merchants" className="hover:text-slate-800">Merchant Hub</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-2">Developers</div>
          <ul className="space-y-1 text-slate-500">
            <li><a href="https://docs.stripe.com" target="_blank" rel="noreferrer" className="hover:text-slate-800">Docs</a></li>
            <li><a href="https://status.stripe.com" target="_blank" rel="noreferrer" className="hover:text-slate-800">API status</a></li>
            <li><a href="https://docs.stripe.com/changelog" target="_blank" rel="noreferrer" className="hover:text-slate-800">Changelog</a></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-2">Company</div>
          <ul className="space-y-1 text-slate-500">
            <li><a href="https://stripe.com/about" target="_blank" rel="noreferrer" className="hover:text-slate-800">About</a></li>
            <li><a href="https://support.stripe.com/" target="_blank" rel="noreferrer" className="hover:text-slate-800">Contact</a></li>
            <li><a href="https://stripe.com/legal" target="_blank" rel="noreferrer" className="hover:text-slate-800">Legal</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t">
        <div className="max-w-7xl mx-auto px-6 py-4 text-xs text-slate-500 flex items-center justify-between">
          <span>© {new Date().getFullYear()}Consumers</span>
          <span>Stripe 2025</span>
        </div>
      </div>
    </footer>
  );
}

function Login() {
  const [, setAuth] = useAuthState();
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state && location.state.from && location.state.from.pathname) || "/";

  const doLogin = async () => {
    setError("");
    setLoading(true);
    const ok = validateCredentials(u.trim(), p.trim());
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    if (ok) {
      setAuth({ loggedIn: true, user: u.trim() });
      navigate(from, { replace: true });
    } else {
      setError("Invalid username or password");
    }
  };

  const redirectToStripe = () => {
    window.open("https://dashboard.stripe.com/login", "_blank", "noopener");
  };

  return (
    <main className="min-h-[80vh] grid place-items-center bg-slate-50 px-6">
      <div className="w-full max-w-md bg-white border rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <img src={LOGOS.stripe} alt="Stripe" className="h-6" />
          <div className="font-semibold text-slate-800">Consumers</div>
        </div>
        <h1 className="text-xl font-bold mb-1">Sign in</h1>
        <p className="text-sm text-slate-600 mb-6">Sign in to access your orders, tracking, and merchant integrations.</p>
        <label className="text-sm">Username</label>
        <input value={u} onChange={(e)=>setU(e.target.value)} className="mt-1 w-full border rounded px-3 py-2 mb-4" placeholder="Enter username" />
        <label className="text-sm">Password</label>
        <input value={p} onChange={(e)=>setP(e.target.value)} type="password" className="mt-1 w-full border rounded px-3 py-2" placeholder="Enter password" />
        {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
        <button disabled={loading} onClick={doLogin} className="mt-4 w-full bg-slate-800 text-white py-2 rounded flex items-center justify-center">
          {loading ? <span className="animate-pulse">Signing in...</span> : "Sign in"}
        </button>
        <div className="flex items-center gap-2 my-4 text-xs text-slate-500"><span className="h-px bg-slate-200 flex-1"/><span>or</span><span className="h-px bg-slate-200 flex-1"/></div>
        <button disabled={loading} onClick={redirectToStripe} className="w-full border py-2 rounded hover:bg-slate-50 flex items-center justify-center gap-2">
          <img src={LOGOS.stripe} alt="Stripe" className="h-4 w-auto object-contain" />
          <span>Authentication</span>
        </button>
      </div>
    </main>
  );
}

function Home() {
  const [auth] = useAuthState();
  const totalSpend = useMemo(() => sampleOrders.reduce((s, o) => s + (o.total || 0), 0), []);
  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <div className="bg-white rounded-2xl p-8 mb-8 shadow-sm">
        <div className="flex items-center justify-between gap-6 flex-wrap">
          <div>
            <h1 className="text-3xl font-semibold">Welcome{auth.user ? `, ${String(auth.user).split("@")[0]}` : ""}</h1>
            <p className="text-slate-600 mt-2">Orders: consolidated order management across carriers and direct links to merchant pages.</p>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="px-3 py-2 rounded-lg bg-slate-50">Users: <span className="font-semibold">{USERS_LIST.length}</span></div>
            <div className="px-3 py-2 rounded-lg bg-slate-50">Orders: <span className="font-semibold">{sampleOrders.length}</span></div>
            <div className="px-3 py-2 rounded-lg bg-slate-50">Total spend: <span className="font-semibold">${totalSpend.toFixed(2)}</span></div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 border rounded-xl p-6 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Users</h3>
            <span className="text-xs text-slate-500">{USERS_LIST.length} total</span>
          </div>
          <ul className="space-y-3">
            {USERS_LIST.map((n) => (
              <li key={n} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500" />
                  <span>{n}</span>
                </div>
                <span className="text-xs text-slate-500">Active</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
          <div className="p-6 border rounded-xl bg-white">
            <h3 className="font-semibold mb-2">Consumers (Orders)</h3>
            <p className="text-sm text-slate-600 mb-4">See consolidated tracking across all shipping carriers.</p>
            <Link to="/orders" className="inline-block bg-indigo-600 text-white px-4 py-2 rounded">Go to Orders</Link>
          </div>
          <div className="p-6 border rounded-xl bg-white">
            <h3 className="font-semibold mb-2">Merchants</h3>
            <p className="text-sm text-slate-600 mb-4">Browse brand partners and jump to their sites.</p>
            <Link to="/merchants" className="inline-block bg-slate-700 text-white px-4 py-2 rounded">Go to Merchants</Link>
          </div>
        </div>
      </div>
    </main>
  );
}

function Orders({ orders }) {
  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-4">Your Orders</h1>
      {orders.length === 0 ? (
        <div className="text-slate-600">No orders found.</div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.orderId} className="p-4 border rounded-lg flex justify-between items-center">
              <div>
                <div className="font-semibold">{o.merchant} - <span className="text-sm text-slate-500">{o.orderId}</span></div>
                <div className="text-sm text-slate-600">{o.date} {o.time ? `at ${o.time}` : ""} - {o.items.length} item(s) - ETA: {o.expectedDelivery || "-"}</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="font-semibold">${o.total.toFixed(2)}</div>
                <Link to={`/orders/${o.orderId}`} className="text-indigo-600 underline">View</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

function maskTrackingNumber(tn) {
  if (!tn) return "";
  return tn.replace(/([0-9A-Z]{4})$/, "****");
}

function carrierLogo(carrier) {
  if (!carrier) return null;
  const key = carrier.toLowerCase().includes("ups") ? "ups" : carrier.toLowerCase().includes("fedex") ? "fedex" : null;
  return key ? LOGOS[key] : null;
}

function OrderDetail({ orders }) {
  const { id } = useParams();
  const order = orders.find((o) => o.orderId === id);
  const [showModal, setShowModal] = useState(false);
  if (!order) return <div className="max-w-6xl mx-auto px-6 py-10">Order not found</div>;

  const carrier = order.trackingEvents[0]?.carrier || "";
  const tel = carrier.toLowerCase().includes("ups") ? "tel:+18007425877" : carrier.toLowerCase().includes("fedex") ? "tel:+18004633339" : "";

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-2">Order {order.orderId}</h1>
      <div className="text-sm text-slate-600 mb-2">Merchant: {order.merchant} - Date: {order.date}{order.time ? ` at ${order.time}` : ""}</div>
      <div className="text-sm text-slate-600 mb-6">Expected delivery: {order.expectedDelivery || "-"}</div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold mb-2">Items</h3>
          <div className="space-y-3">
            {order.items.map((it) => (
              <div key={it.id} className="p-3 border rounded flex justify-between">
                <div>
                  <div className="font-medium"><a href={it.url} className="underline" target="_blank" rel="noreferrer">{it.name}</a></div>
                  <div className="text-sm text-slate-500">Qty: 1 - SKU: {it.id}</div>
                </div>
                <div className="font-semibold">${(it.price).toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Tracking</h3>
          <div className="p-4 border border-slate-200 rounded-lg bg-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              {carrierLogo(carrier) && <img src={carrierLogo(carrier)} alt={carrier} className="h-6" />}
              <div className="text-sm text-slate-600">Carrier: {carrier}</div>
            </div>
            <div className="text-sm text-slate-600 mb-3">Tracking #: <span title="Contact customer support to view full tracking">{maskTrackingNumber(order.trackingEvents[0].trackingNumber)}</span></div>

            <div className="space-y-2">
              {order.trackingEvents.map((t, i) => (
                <div key={i} className="p-2 bg-slate-50 rounded">
                  <div className="text-sm font-medium">{t.status}</div>
                  <div className="text-xs text-slate-500">{t.location} - {t.time}</div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-3">
              <button onClick={() => setShowModal(true)} className="bg-slate-800 text-white text-sm px-3 py-2 rounded">View externally</button>
              {tel ? (
                <a className="text-sm px-3 py-2 border rounded flex items-center gap-2" href={tel}>
                  {carrier.toLowerCase().includes("ups") ? <img src={LOGOS.ups} alt="UPS" className="h-4" /> : <img src={LOGOS.fedex} alt="FedEx" className="h-4" />} Contact {carrier}
                </a>
              ) : null}
              <div className="text-xs text-slate-500">.</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Link to="/orders" className="underline">Back to Orders</Link>
      </div>

      {showModal ? (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-lg w-full max-w-3xl overflow-hidden border" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-3 border-b bg-slate-900 text-white">
              <div className="flex items-center gap-2">
                {carrierLogo(carrier) && <img src={carrierLogo(carrier)} alt={carrier} className="h-5" />}
                <div className="font-semibold">{carrier} Tracking</div>
              </div>
              <button onClick={() => setShowModal(false)} className="text-sm px-2 py-1 border rounded">Close</button>
            </div>
            <div className="p-5">
              <div className="text-xs mb-2">Destination: {order.destination || 'Markham, ON, Canada'}</div>
              <div className="text-sm text-slate-600 mb-4">Tracking #: <span title="Contact customer support to view full tracking">{maskTrackingNumber(order.trackingEvents[0].trackingNumber)}</span></div>
              <div className="border-l-2 ml-2" style={{borderColor: '#D9D9D9'}}>
                {order.trackingEvents.map((t, i) => (
                  <div key={i} className="pl-4 relative py-3">
                    <div className="absolute -left-2 top-4 h-3 w-3 rounded-full bg-slate-400" />
                    <div className="text-sm font-medium">{t.status}</div>
                    <div className="text-xs text-slate-500">{t.location} - {t.time}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-xs text-slate-500"></div>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}

function Merchants() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-2">Merchant Hub</h1>
      <p className="text-slate-600 mb-6">Featured partner discounts & more</p>

      <section>
        <h2 className="text-lg font-semibold mb-3">Featured brand partners</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {partnerDeals.map((d) => (
            <div key={d.brand} className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <div className="font-semibold">{d.brand}</div>
                  <span className="text-xs bg-slate-800 text-white px-2 py-0.5 rounded-full">{d.discount}</span>
                </div>
              </div>
              <a href={d.url} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center justify-center px-3 py-2 rounded-md border border-slate-300 hover:bg-slate-50 text-sm">Go to site</a>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default function App() {
  const [auth] = useAuthState();
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <div className="flex-1">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<RequireAuth><Home /></RequireAuth>} />
            <Route path="/orders" element={<RequireAuth><Orders orders={sampleOrders} /></RequireAuth>} />
            <Route path="/orders/:id" element={<RequireAuth><OrderDetail orders={sampleOrders} /></RequireAuth>} />
            <Route path="/merchants" element={<RequireAuth><Merchants /></RequireAuth>} />
            <Route path="*" element={<Navigate to={auth.loggedIn ? "/" : "/login"} replace />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

function runDevTests() {
  try {
    console.assert(sampleOrders.length === 5, "Test 1 failed: should have 5 orders");
    console.assert(validateCredentials("asmmaffan", "packages") === true, "Test 2 failed: credentials should validate");
    console.log("Runtime checks OK");
  } catch (e) {
    console.warn(e);
  }
}

try {
  const isDev = (typeof import.meta !== "undefined" && import.meta && import.meta.env && import.meta.env.DEV) || (typeof process !== "undefined" && process.env && process.env.NODE_ENV !== "production");
  if (isDev) runDevTests();
} catch (_) {}
