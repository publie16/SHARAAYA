import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import "./ProductCard.css";

function getWishlist() {
  try { return JSON.parse(localStorage.getItem("sharaaya_wishlist") || "[]"); }
  catch (_) { return []; }
}
function setWishlist(list) {
  localStorage.setItem("sharaaya_wishlist", JSON.stringify(list));
  window.dispatchEvent(new Event("sharaaya_wishlist_change"));
}

export default function ProductCard({ product, onOpenDetail }) {
  const [wishlisted, setWishlisted] = useState(() => getWishlist().includes(product.id));
  const [imgError, setImgError] = useState(false);
  const { addToCart } = useCart();

  const toggleWishlist = (e) => {
    e.stopPropagation();
    const w = getWishlist();
    const next = w.includes(product.id) ? w.filter(id => id !== product.id) : [...w, product.id];
    setWishlist(next);
    setWishlisted(!wishlisted);
  };

  const isLowStock = product.inStock && product.stock > 0 && product.stock <= 3;
  const isOOS = !product.inStock || product.stock === 0;
  const img = (!imgError && product.images?.[0]) ? product.images[0] : product.images?.[1] || "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&q=80";

  return (
    <article className={`product-card${isOOS ? " product-card--oos" : ""}`} onClick={() => !isOOS && onOpenDetail?.(product)}>
      <div className="product-card__img-wrap">
        <img
          src={img}
          alt={product.name}
          className="product-card__img"
          loading="lazy"
          onError={() => setImgError(true)}
        />
        {isOOS && <div className="product-card__oos-overlay"><span>Out of Stock</span></div>}
        {isLowStock && !isOOS && (
          <span className="product-card__low-badge">Only {product.stock} left!</span>
        )}
        <button
          className={`product-card__heart${wishlisted ? " product-card__heart--active" : ""}`}
          onClick={toggleWishlist}
          aria-label="Toggle wishlist"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill={wishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </button>
      </div>

      <div className="product-card__body">
        <span className="badge badge-blush product-card__tag">{product.material}</span>
        <h3 className="product-card__name">{product.name}</h3>
        <p className="product-card__desc">{product.shortDescription}</p>
        <div className="product-card__footer">
          <span className="product-card__price">₹{product.price}</span>
          {!isOOS ? (
            <button
              className="btn btn-gold btn-sm"
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product);
              }}
            >
              Add to Cart
            </button>
          ) : (
            <span className="btn btn-outline btn-sm product-card__notify">Notify Me</span>
          )}
        </div>
      </div>
    </article>
  );
}
