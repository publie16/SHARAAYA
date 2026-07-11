import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import { CATEGORIES } from "../data/config";
import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductModal";
import "./Catalogue.css";

const PRICE_RANGES = [
  { label: "All Prices", max: Infinity },
  { label: "Under ₹100", max: 99 },
  { label: "₹100 – ₹199", max: 199, min: 100 },
  { label: "₹200+", min: 200, max: Infinity },
];

export default function Catalogue() {
  const { searchProducts } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState(searchParams.get("cat") || "all");
  const [priceIdx, setPriceIdx] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [visible, setVisible] = useState(false);
  const gridRef = useRef(null);

  useEffect(() => { setVisible(true); }, []);

  useEffect(() => {
    const cat = searchParams.get("cat");
    if (cat) { setActiveCat(cat); scrollToGrid(); }
  }, [searchParams]);

  const scrollToGrid = () => {
    setTimeout(() => gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  };

  const priceRange = PRICE_RANGES[priceIdx];
  const filters = {
    category: activeCat,
    priceMax: priceRange.max === Infinity ? undefined : priceRange.max,
  };
  let results = searchProducts(query, filters);
  if (priceRange.min) results = results.filter(p => p.price >= priceRange.min);

  const handleCatClick = (id) => {
    setActiveCat(id);
    setSearchParams(id !== "all" ? { cat: id } : {});
    scrollToGrid();
  };

  return (
    <div className={`catalogue${visible ? " catalogue--visible" : ""}`} style={{ paddingTop: "80px" }}>
      {/* Header */}
      <div className="catalogue__header">
        <div className="container text-center">
          <hr className="gold-divider" style={{ marginBottom: "1rem" }} />
          <h1>The Sharaaya Collection</h1>
          <p className="catalogue__sub">Handpicked earrings for every vibe — under ₹250 always 🌸</p>
        </div>
      </div>

      <div className="container" ref={gridRef}>
        {/* Search */}
        <div className="catalogue__search-wrap">
          <div className="catalogue__search-box">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              className="catalogue__search-input"
              placeholder="Search earrings by name or material…"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            {query && (
              <button className="catalogue__search-clear" onClick={() => setQuery("")}>✕</button>
            )}
          </div>
        </div>

        {/* Category Chips */}
        <div className="catalogue__chips">
          <button
            className={`catalogue__chip${activeCat === "all" ? " catalogue__chip--active" : ""}`}
            onClick={() => handleCatClick("all")}
          >All</button>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              className={`catalogue__chip${activeCat === cat.id ? " catalogue__chip--active" : ""}`}
              onClick={() => handleCatClick(cat.id)}
            >
              {cat.emoji} {cat.name}
            </button>
          ))}
        </div>

        {/* Price Filter */}
        <div className="catalogue__price-chips">
          {PRICE_RANGES.map((r, i) => (
            <button
              key={i}
              className={`catalogue__chip catalogue__chip--sm${priceIdx === i ? " catalogue__chip--active" : ""}`}
              onClick={() => setPriceIdx(i)}
            >{r.label}</button>
          ))}
        </div>

        {/* Results count */}
        <p className="catalogue__count">
          {results.length} {results.length === 1 ? "earring" : "earrings"} found
          {activeCat !== "all" && ` in ${CATEGORIES.find(c => c.id === activeCat)?.name}`}
        </p>

        {/* Grid */}
        {results.length > 0 ? (
          <div className="catalogue__grid">
            {results.map((p, i) => (
              <div key={p.id} className="catalogue__grid-item" style={{ animationDelay: `${i * 0.05}s` }}>
                <ProductCard product={p} onOpenDetail={setSelectedProduct} />
              </div>
            ))}
          </div>
        ) : (
          <div className="catalogue__empty">
            <div className="catalogue__empty-icon">🔍</div>
            <h3>No earrings found</h3>
            <p>Try a different search or filter. We're always adding new pieces!</p>
            <button className="btn btn-outline" onClick={() => { setQuery(""); setActiveCat("all"); setPriceIdx(0); }}>
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </div>
  );
}
