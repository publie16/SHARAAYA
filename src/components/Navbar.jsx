import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./Navbar.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const { count: cartCount } = useCart();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const update = () => {
      try {
        const w = JSON.parse(localStorage.getItem("sharaaya_wishlist") || "[]");
        setWishlistCount(w.length);
      } catch (_) {}
    };
    update();
    window.addEventListener("sharaaya_wishlist_change", update);
    return () => window.removeEventListener("sharaaya_wishlist_change", update);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/catalogue", label: "Catalogue" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  const isActive = (path) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <header className={`navbar${scrolled ? " navbar--scrolled" : ""}`}>
      <div className="container navbar__inner">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-s">S</span>
          <span className="navbar__logo-text">haraaya</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="navbar__links">
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to} className={`navbar__link${isActive(l.to) ? " navbar__link--active" : ""}`}>
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="navbar__actions">
          {wishlistCount > 0 && (
            <span className="navbar__wishlist-badge">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              <span className="navbar__wishlist-count">{wishlistCount}</span>
            </span>
          )}
          <Link to="/cart" className="btn btn-outline btn-sm navbar__cta">Cart{cartCount > 0 ? ` (${cartCount})` : ""}</Link>
          <Link to="/admin/login" className="btn btn-outline btn-sm navbar__cta navbar__admin-btn">🔐 Admin</Link>
          <Link to="/catalogue" className="btn btn-gold btn-sm navbar__cta">Shop Now</Link>
          <button
            className={`navbar__burger${menuOpen ? " navbar__burger--open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="navbar__mobile">
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to} className={`navbar__mobile-link${isActive(l.to) ? " active" : ""}`}>
              {l.label}
            </Link>
          ))}
          <Link to="/cart" className="btn btn-outline" style={{ marginTop: "0.5rem" }}>
            🛍️ Cart{cartCount > 0 ? ` (${cartCount})` : ""}
          </Link>
          <Link to="/admin/login" className="btn btn-outline" style={{ marginTop: "0.5rem" }}>
            🔐 Admin Login
          </Link>
          <Link to="/catalogue" className="btn btn-gold" style={{ marginTop: "0.5rem" }}>
            ✨ Shop Now
          </Link>
        </div>
      )}
    </header>
  );
}
