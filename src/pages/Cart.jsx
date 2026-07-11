import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { WHATSAPP_GROUP_LINK } from "../data/config";
import "./Cart.css";

function buildWhatsAppMessage(items) {
  const lines = items.map((item) => `• ${item.productId ? `${item.productId} - ` : ""}${item.name} x${item.quantity} — ₹${item.price * item.quantity}`);
  const body = [
    "Hi Sharaaya! 🌸 I’d like to place this order:",
    ...lines,
    "",
    `Total: ₹${items.reduce((sum, item) => sum + item.price * item.quantity, 0)}`,
    "Please confirm availability and delivery details.",
  ].join("\n");
  return encodeURIComponent(body);
}

export default function Cart() {
  const { items, count, total, updateQuantity, removeFromCart, clearCart } = useCart();
  const [showEmptyAlert, setShowEmptyAlert] = useState(false);

  const whatsappUrl = `${WHATSAPP_GROUP_LINK}?text=${buildWhatsAppMessage(items)}`;

  const handleOrderClick = (event) => {
    if (!items.length) {
      event.preventDefault();
      setShowEmptyAlert(true);
    }
  };

  return (
    <div className="cart-page">
      <div className="container cart-page__wrap">
        <div className="cart-page__header">
          <div>
            <p className="badge badge-gold">Your Cart</p>
            <h1 className="cart-page__title">{count > 0 ? `${count} item${count > 1 ? "s" : ""} ready to order` : "Your cart is empty"}</h1>
            <p className="cart-page__sub">Add your favourite earrings, then send your selection directly to WhatsApp.</p>
          </div>
          <Link to="/catalogue" className="btn btn-outline">Continue Shopping</Link>
        </div>

        {items.length === 0 ? (
          <div className="card cart-page__empty">
            <h3>No earrings selected yet</h3>
            <p>Browse the catalogue and add pieces you love to your cart.</p>
            <Link to="/catalogue" className="btn btn-gold">Browse Earrings</Link>
          </div>
        ) : (
          <div className="cart-page__content">
            <div className="cart-page__list">
              {items.map((item) => (
                <div key={item.id} className="card cart-page__item">
                  <img src={item.images?.[0] || "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&q=80"} alt={item.name} className="cart-page__image" />
                  <div className="cart-page__details">
                    <div>
                      <h3>{item.name}</h3>
                      <p>{item.shortDescription}</p>
                      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.3rem" }}>
                        <span className="badge badge-blush">{item.category}</span>
                        {item.productId && <span className="badge badge-gold">ID: {item.productId}</span>}
                      </div>
                    </div>
                    <div className="cart-page__actions">
                      <div className="cart-page__qty">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label={`Decrease ${item.name}`}>
                          −
                        </button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label={`Increase ${item.name}`}>
                          +
                        </button>
                      </div>
                      <strong>₹{item.price * item.quantity}</strong>
                      <button className="cart-page__remove" onClick={() => removeFromCart(item.id)}>
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside className="card cart-page__summary">
              <h3>Order Summary</h3>
              <div className="cart-page__summary-row">
                <span>Items</span>
                <strong>{count}</strong>
              </div>
              <div className="cart-page__summary-row">
                <span>Total</span>
                <strong>₹{total}</strong>
              </div>
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="btn btn-whatsapp" style={{ width: "100%", justifyContent: "center" }} onClick={handleOrderClick}>
                Order on WhatsApp
              </a>
              <button className="btn btn-outline" style={{ width: "100%", justifyContent: "center" }} onClick={clearCart}>
                Clear Cart
              </button>
            </aside>
          </div>
        )}

        {showEmptyAlert && (
          <div className="cart-page__alert-backdrop" onClick={() => setShowEmptyAlert(false)}>
            <div className="cart-page__alert" onClick={(e) => e.stopPropagation()}>
              <h3>Please add items to cart first to order.</h3>
              <p>Your cart is empty right now. Browse the catalogue and add your favourite earrings before ordering.</p>
              <div className="cart-page__alert-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowEmptyAlert(false)}>Close</button>
                <Link to="/catalogue" className="btn btn-gold" onClick={() => setShowEmptyAlert(false)}>Go to Catalogue</Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
