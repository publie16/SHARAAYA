import React, { useState } from "react";
import { WHATSAPP_GROUP_LINK, INSTAGRAM_URL, INSTAGRAM_HANDLE, DELIVERY_INFO } from "../data/config";
import "./Contact.css";

export default function Contact() {
  const [form, setForm] = useState({ name: "", room: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSend = (e) => {
    e.preventDefault();
    const msg = encodeURIComponent(
      `Hi Sharaaya! 🌸\nName: ${form.name}\nRoom: ${form.room}\nMessage: ${form.message}`
    );
    window.open(`${WHATSAPP_GROUP_LINK}?text=${msg}`, "_blank");
    setSent(true);
  };

  return (
    <div className="contact" style={{ paddingTop: "80px" }}>
      <div className="contact__header">
        <div className="container text-center">
          <hr className="gold-divider" style={{ marginBottom: "1rem" }} />
          <h1>Order from Sharaaya</h1>
          <p className="contact__header-sub">Ready to find your new favourite earrings? Let's chat! 💬</p>
        </div>
      </div>

      <div className="container section-pad">
        <div className="contact__grid">

          {/* Left: WhatsApp + Delivery */}
          <div className="contact__left">
            <div className="contact__wa-card">
              <div className="contact__wa-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              <h2>Order on WhatsApp</h2>
              <p>The easiest way to order! Just tap below, tell us which earrings you love, and we'll sort out delivery. 🌸</p>
              <a href={WHATSAPP_GROUP_LINK} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-lg contact__wa-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Chat with Sharaaya
              </a>
            </div>

            <div className="contact__delivery-card card">
              <h3>📦 Delivery Info</h3>
              <hr className="gold-divider" style={{ margin: "0.75rem 0" }} />
              <div className="contact__delivery-row">
                <span>📍 Area</span>
                <strong>{DELIVERY_INFO.area}</strong>
              </div>
              <div className="contact__delivery-row">
                <span>📅 Days</span>
                <strong>Saturday and Sunday</strong>
              </div>
              <p className="contact__delivery-note">{DELIVERY_INFO.note}</p>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="contact__right">
            <div className="card contact__form-card">
              <h3>Send a Message 💌</h3>
              <p className="contact__form-sub">Fill in the form below and we'll get back to you on WhatsApp!</p>
              {sent ? (
                <div className="contact__success">
                  <div className="contact__success-icon">🎉</div>
                  <h3>Message Sent!</h3>
                  <p>Opening WhatsApp with your message. We'll reply soon! 🌸</p>
                  <button className="btn btn-outline" onClick={() => setSent(false)}>Send another</button>
                </div>
              ) : (
                <form onSubmit={handleSend}>
                  <div className="form-group">
                    <label className="form-label">Your Name *</label>
                    <input className="form-input" placeholder="e.g. Priya Sharma" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Hostel / Room No.</label>
                    <input className="form-input" placeholder="e.g. Block C, Room 204" value={form.room} onChange={e => setForm(f => ({ ...f, room: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Your Message *</label>
                    <textarea className="form-input" rows="5" placeholder="Tell us which earrings you're interested in! 🌸" required value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} style={{ resize: "vertical" }} />
                  </div>
                  <button type="submit" className="btn btn-whatsapp btn-lg" style={{ width: "100%", justifyContent: "center" }}>
                    Send via WhatsApp 💬
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
