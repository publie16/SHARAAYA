import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./AdminLogin.css";

export default function AdminLogin() {
  const { login, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [creds, setCreds] = useState({ username: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isLoggedIn) { navigate("/admin"); return null; }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise(r => setTimeout(r, 600)); // brief delay for UX
    const result = login(creds.username, creds.password);
    if (result.success) {
      navigate("/admin");
    } else {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <Link to="/" className="admin-login__logo">
          <span className="admin-login__logo-s">S</span>haraaya
        </Link>
        <h2 className="admin-login__title">Admin Login</h2>
        <p className="admin-login__sub">Restricted access — authorised admins only</p>

        <form onSubmit={handleSubmit} className="admin-login__form">
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              className="form-input"
              type="text"
              placeholder="Enter your username"
              autoComplete="username"
              required
              value={creds.username}
              onChange={e => setCreds(c => ({ ...c, username: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="admin-login__pass-wrap">
              <input
                className="form-input"
                type={showPass ? "text" : "password"}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                value={creds.password}
                onChange={e => setCreds(c => ({ ...c, password: e.target.value }))}
              />
              <button
                type="button"
                className="admin-login__eye"
                onClick={() => setShowPass(s => !s)}
                aria-label="Toggle password"
              >
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>
          </div>
          {error && <div className="admin-login__error">{error}</div>}
          <button type="submit" className="btn btn-gold" style={{ width: "100%", justifyContent: "center" }} disabled={loading}>
            {loading ? <span className="spinner" style={{ width:18,height:18,borderWidth:2 }} /> : "Login →"}
          </button>
        </form>

        <Link to="/" className="admin-login__back">← Back to Sharaaya</Link>
      </div>
    </div>
  );
}
