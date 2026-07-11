import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import "./ProductModal.css";

export default function ProductModal({ product, onClose }) {
  const [activeImg, setActiveImg] = useState(0);
  const { addToCart } = useCart();

  if (!product) return null;

  const isOOS = !product.inStock || product.stock === 0;
  const isLow = product.inStock && product.stock > 0 && product.stock <= 3;
  const imgs = product.images?.length ? product.images : ["https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80"];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal__close" onClick={onClose} aria-label="Close">✕</button>

        <div className="modal__inner">
          {/* Images */}
          <div className="modal__gallery">
            <div className="modal__main-img-wrap">
              <img src={imgs[activeImg]} alt={product.name} className="modal__main-img" />
              {isOOS && (
                <div className="modal__oos-badge">Out of Stock</div>
              )}
              {isLow && !isOOS && (
                <div className="modal__low-badge">🔥 Only {product.stock} left!</div>
              )}
            </div>
            {imgs.length > 1 && (
              <div className="modal__thumbs">
                {imgs.map((src, i) => (
                  <button
                    key={i}
                    className={`modal__thumb${activeImg === i ? " modal__thumb--active" : ""}`}
                    onClick={() => setActiveImg(i)}
                  >
                    <img src={src} alt={`View ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="modal__info">
            <span className="badge badge-blush">{product.material}</span>
            <h2 className="modal__name">{product.name}</h2>
            <div className="modal__price">₹{product.price}</div>
            <p className="modal__desc">{product.fullDescription || product.shortDescription}</p>

            <div className="modal__meta">
              <div className="modal__meta-row">
                <span className="modal__meta-label">Category</span>
                <span className="modal__meta-value">{product.category}</span>
              </div>
              <div className="modal__meta-row">
                <span className="modal__meta-label">Material</span>
                <span className="modal__meta-value">{product.material}</span>
              </div>
              <div className="modal__meta-row">
                <span className="modal__meta-label">Stock</span>
                <span className={`modal__meta-value ${isOOS ? "oos" : isLow ? "low" : "ok"}`}>
                  {isOOS ? "Out of Stock" : isLow ? `Only ${product.stock} left` : "In Stock ✓"}
                </span>
              </div>
            </div>

            <hr className="gold-divider" style={{ margin: "1.2rem 0" }} />

            {!isOOS ? (
              <button className="btn btn-gold btn-lg" style={{ width: "100%", justifyContent: "center" }} onClick={() => addToCart(product)}>
                Add to Cart
              </button>
            ) : (
              <div className="modal__oos-msg">
                This item is currently out of stock. Check back soon! 🌸
              </div>
            )}

            <button className="modal__back" onClick={onClose}>← Back to Catalogue</button>
          </div>
        </div>
      </div>
    </div>
  );
}
