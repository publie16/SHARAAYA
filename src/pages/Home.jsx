import React, { useRef, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import { useCart } from "../context/CartContext";
import { CATEGORIES, WHATSAPP_GROUP_LINK } from "../data/config";
import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductModal";
import "./Home.css";

function useScrollReveal(ref) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("revealed"); }),
      { threshold: 0.12 }
    );
    if (ref.current) ref.current.querySelectorAll(".reveal").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [ref]);
}

export default function Home() {
  const { products, getFeatured } = useProducts();
  const { items, count } = useCart();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showCartAlert, setShowCartAlert] = useState(false);
  const navigate = useNavigate();
  const mainRef = useRef(null);
  useScrollReveal(mainRef);

  const featured = getFeatured().slice(0, 4);
  const newest = [...products].sort((a, b) => b.createdAt - a.createdAt).slice(0, 4);

  const handleOrderNow = () => {
    if (!items.length) {
      setShowCartAlert(true);
      return;
    }

    const lines = items.map((item) => `• ${item.productId ? `${item.productId} - ` : ""}${item.name} x${item.quantity} — ₹${item.price * item.quantity}`);
    const body = [
      "Hi Sharaaya! 🌸 I’d like to place this order:",
      ...lines,
      "",
      `Total: ₹${items.reduce((sum, item) => sum + item.price * item.quantity, 0)}`,
      "Please confirm availability and delivery details.",
    ].join("\n");

    window.open(`${WHATSAPP_GROUP_LINK}?text=${encodeURIComponent(body)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div ref={mainRef}>
      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero__bg">
          <img src="/images/hero-banner.png" alt="Sharaaya earrings collection" className="hero__bg-img" loading="eager" onError={e => { e.target.style.display='none'; }} />
          <div className="hero__overlay" />
        </div>
        <div className="container hero__content">
          <div className="hero__wordmark fade-in">
            <span className="hero__s">S</span><span className="hero__rest">haraaya</span>
          </div>
          <h1 className="hero__tagline slide-up">Little Earrings,<br /><em>Big Sparkle.</em></h1>
          <p className="hero__sub slide-up">Trendy, affordable earrings made for hostel girls — by a hostel girl. 🌸</p>
          <div className="hero__ctas slide-up">
            <Link to="/catalogue" className="btn btn-gold btn-lg">Browse Catalogue</Link>
            <button type="button" className="btn btn-whatsapp btn-lg" onClick={handleOrderNow}>Order on WhatsApp</button>
          </div>
        </div>
        <div className="hero__scroll-hint">
          <span>Scroll to explore</span>
          <div className="hero__scroll-line" />
        </div>
      </section>

      {/* ── BRAND INTRO ───────────────────────────────────────── */}
      <section className="section-pad" style={{ background: "var(--white)" }}>
        <div className="container text-center reveal">
          <hr className="gold-divider" />
          <h2 style={{ marginTop: "1rem" }}>Welcome to <span className="gold-shimmer">Sharaaya</span></h2>
          <p className="home__intro-text">
            We believe every college girl deserves gorgeous earrings without burning through her monthly budget.
            Sharaaya started in a tiny hostel room with a big dream — to make jewellery that's as fun and budget-friendly
            as it is beautiful. Browse our ever-growing collection, add your favourites to the cart, and send your order straight from there. ✨
          </p>
          <Link to="/about" className="btn btn-outline" style={{ marginTop: "1.5rem" }}>Our Story →</Link>
        </div>
      </section>

      {/* ── CATEGORIES ────────────────────────────────────────── */}
      <section className="section-pad" style={{ background: "var(--beige)" }}>
        <div className="container">
          <div className="text-center reveal">
            <hr className="gold-divider" />
            <h2 style={{ marginTop: "1rem" }}>Shop by Category</h2>
            <p className="home__section-sub">Find exactly what you're looking for ✨</p>
          </div>
          <div className="home__cat-grid">
            {CATEGORIES.map((cat, i) => (
              <Link
                key={cat.id}
                to={`/catalogue?cat=${cat.id}`}
                className="home__cat-tile reveal"
                style={{ background: cat.color, animationDelay: `${i * 0.08}s` }}
              >
                <div className="home__cat-img-wrap">
                  <img src={cat.image} alt={cat.name} loading="lazy" onError={e => { e.target.parentElement.innerHTML = `<span class="home__cat-emoji">${cat.emoji}</span>`; }} />
                </div>
                <div className="home__cat-label">
                  <span>{cat.emoji}</span>
                  <strong>{cat.name}</strong>
                  <small>{cat.description}</small>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ─────────────────────────────────── */}
      {featured.length > 0 && (
        <section className="section-pad" style={{ background: "var(--cream)" }}>
          <div className="container">
            <div className="text-center reveal">
              <hr className="gold-divider" />
              <h2 style={{ marginTop: "1rem" }}>✨ Featured Picks</h2>
              <p className="home__section-sub">Our most loved pieces right now</p>
            </div>
            <div className="home__product-grid">
              {featured.map(p => (
                <div key={p.id} className="reveal">
                  <ProductCard product={p} onOpenDetail={setSelectedProduct} />
                </div>
              ))}
            </div>
            <div className="text-center reveal" style={{ marginTop: "2.5rem" }}>
              <Link to="/catalogue" className="btn btn-gold btn-lg">View Full Catalogue</Link>
            </div>
          </div>
        </section>
      )}

      {/* ── WHY SHARAAYA ──────────────────────────────────────── */}
      <section className="section-pad" style={{ background: "linear-gradient(135deg,var(--lavender),var(--blush))" }}>
        <div className="container">
          <div className="text-center reveal">
            <hr className="gold-divider" />
            <h2 style={{ marginTop: "1rem" }}>Why Sharaaya? 🌸</h2>
          </div>
          <div className="home__why-grid">
            {[
              { icon: "💸", title: "Hostel Friendly Prices", desc: "All earrings under ₹250. Because you have textbooks to buy too." },
              { icon: "📦", title: "Hostel Delivery", desc: "Drop us a WhatsApp message and we'll deliver right to your room door." },
              { icon: "🎨", title: "Curated Styles", desc: "From oxidised boho to festive glam — we have something for every mood." },
              { icon: "🤍", title: "Made with Love", desc: "Every piece is personally sourced and packed by yours truly — a fellow hostel girl." },
            ].map((item, i) => (
              <div key={i} className="home__why-card reveal card">
                <div className="home__why-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {showCartAlert && (
        <div className="home__cart-alert-backdrop" onClick={() => setShowCartAlert(false)}>
          <div className="home__cart-alert" onClick={(e) => e.stopPropagation()}>
            <h3>Please add items to cart first to order.</h3>
            <p>Your cart is empty right now. Browse the catalogue and add your favourite earrings before ordering.</p>
            <div className="home__cart-alert-actions">
              <button type="button" className="btn btn-outline" onClick={() => setShowCartAlert(false)}>Close</button>
              <Link to="/catalogue" className="btn btn-gold" onClick={() => setShowCartAlert(false)}>Go to Catalogue</Link>
            </div>
          </div>
        </div>
      )}

      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </div>
  );
}
