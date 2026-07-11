import React from "react";
import "./About.css";

export default function About() {
  return (
    <div className="about" style={{ paddingTop: "80px" }}>
      {/* Header */}
      <div className="about__header">
        <div className="container text-center">
          <hr className="gold-divider" style={{ marginBottom: "1rem" }} />
          <h1>The Sharaaya Story</h1>
          <p className="about__header-sub">A hostel room, a dream, and a pair of earrings. 🌸</p>
        </div>
      </div>

      {/* Main story */}
      <section className="section-pad" style={{ background: "var(--white)" }}>
        <div className="container about__story">
          <div className="about__story-img-wrap">
            <img
              src="/images/about.jpg"
              alt="Sharaaya founder in hostel room with earrings"
              className="about__story-img"
              loading="lazy"
              onError={e => { e.target.parentElement.innerHTML = '<div class="about__img-fallback"><span>🌸</span><p>The Sharaaya Story</p></div>'; }}
            />
            <div className="about__story-badge">Est. 2024 🎓</div>
          </div>
          <div className="about__story-text">
            <span className="badge badge-blush" style={{ marginBottom: "1rem", display: "inline-block" }}>Our Story</span>
            <h2>Started from a hostel room. Built for every hostel girl. 💛</h2>
            <hr className="gold-divider" style={{ margin: "1rem 0" }} />
            <p>
              Hi! We are the girls behind Sharaaya — third-year students who started selling earrings from there tiny hostel room because we were tired of choosing between cute jewellery and lunch money. 😅
            </p>
            <p>
              It started small. A few pairs on a bed, some fairy lights for photos, and a WhatsApp group with my hostel floormates. The response was so sweet and overwhelming — girls started asking for new designs every week. That's when we knew Sharaaya was something real.
            </p>
            <p>
              Every earring you see here is personally sourced, inspected, and packed by us. We care deeply about quality — if we wouldn't wear it ourself, it doesn't make it into the catalogue. Our promise to you: always trendy, always affordable, always delivered with love. ✨
            </p>
            <div className="about__highlights">
              {[
                { num: "₹35", label: "Starting Price" },
                { num: "4", label: "Collections" },
              ].map((h, i) => (
                <div key={i} className="about__highlight">
                  <strong>{h.num}</strong>
                  <span>{h.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-pad" style={{ background: "var(--beige)" }}>
        <div className="container text-center">
          <hr className="gold-divider" />
          <h2 style={{ marginTop: "1rem" }}>What Sharaaya Stands For</h2>
          <div className="about__values">
            {[
              { icon: "🌱", title: "Affordable Always", desc: "Student budgets are real. Every piece is priced so you can treat yourself without guilt." },
              { icon: "💎", title: "Quality First", desc: "Each piece is personally checked. No tarnishing, no itching — just beautiful earrings." },
              { icon: "🤝", title: "Community Driven", desc: "You suggest designs, I source them. Sharaaya grows with your feedback and wishes." },
              { icon: "📦", title: "Hostel Delivery", desc: "No need to walk to the gate a mile away to get your cute and trendy earrings!" },
            ].map((v, i) => (
              <div key={i} className="about__value-card card">
                <div className="about__value-icon">{v.icon}</div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
