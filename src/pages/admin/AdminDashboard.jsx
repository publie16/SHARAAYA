import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useProducts } from "../../context/ProductContext";
import { CATEGORIES } from "../../data/config";

const emptyForm = {
  name: "",
  productId: "",
  price: "",
  category: "casual",
  material: "",
  shortDescription: "",
  fullDescription: "",
  stock: "5",
  featured: false,
};

export default function AdminDashboard() {
  const { admin, logout } = useAuth();
  const { addProduct, deleteProduct, products } = useProducts();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const handleImageSelect = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const maxSize = 1.8 * 1024 * 1024; // 1.8 MB per image
    const validFiles = files.filter((file) => {
      if (file.size > maxSize) {
        setMessage("One or more images are too large. Please use smaller images under 2MB.");
        return false;
      }
      return true;
    });

    if (!validFiles.length) return;

    const encoded = await Promise.all(
      validFiles.map(
        (file) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          })
      )
    );

    setImages((prev) => [...prev, ...encoded].slice(0, 6));
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.productId.trim() || !form.price || !form.shortDescription.trim() || images.length === 0) {
      setMessage("Please add a product ID, name, price, short description and at least one image.");
      return;
    }

    setLoading(true);
    const product = {
      productId: form.productId.trim(),
      name: form.name.trim(),
      price: Number(form.price),
      category: form.category,
      material: form.material.trim(),
      shortDescription: form.shortDescription.trim(),
      fullDescription: form.fullDescription.trim(),
      images,
      stock: Number(form.stock) || 0,
      inStock: Number(form.stock) > 0,
      featured: Boolean(form.featured),
    };

    try {
      addProduct(product);
      setTimeout(() => {
        setMessage("Earring added to the storefront successfully.");
        setForm(emptyForm);
        setImages([]);
        setLoading(false);
      }, 400);
    } catch (error) {
      console.error("Failed to add product", error);
      setMessage("Unable to add product. Please try smaller images or refresh the page.");
      setLoading(false);
    }
  };

  const handleDeleteProduct = (id, name) => {
    if (!window.confirm(`Delete ${name} from the storefront?`)) return;

    deleteProduct(id);
    setMessage(`Removed ${name} from the storefront.`);
  };

  const previewCount = useMemo(() => images.length, [images]);

  return (
    <div style={{ minHeight: "100vh", background: "#f7f4ed", padding: "2rem" }}>
      <div style={{ maxWidth: "980px", margin: "0 auto", background: "#fff", borderRadius: "16px", padding: "2rem", boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={{ margin: 0, color: "#7a5f2a", textTransform: "uppercase", letterSpacing: "0.25em" }}>Admin Panel</p>
            <h1 style={{ margin: "0.5rem 0 0" }}>Welcome, {admin?.name || admin?.username || "Admin"}.</h1>
          </div>
          <button type="button" onClick={handleLogout} style={{ border: "none", borderRadius: "999px", background: "#7a5f2a", color: "#fff", padding: "0.75rem 1rem", cursor: "pointer" }}>
            Logout
          </button>
        </div>

        <p style={{ marginTop: "1rem", color: "#555" }}>
          Only authorised admins can manage the showroom here. Upload your own images, set the category, and publish new earrings instantly.
        </p>

        <form onSubmit={handleSubmit} style={{ marginTop: "2rem", display: "grid", gap: "1rem" }}>
          <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
            <div>
              <label className="form-label">Earring name</label>
              <input className="form-input" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} required />
            </div>
            <div>
              <label className="form-label">Product ID</label>
              <input className="form-input" value={form.productId} onChange={(e) => setForm((prev) => ({ ...prev, productId: e.target.value }))} required />
            </div>
            <div>
              <label className="form-label">Price (₹)</label>
              <input className="form-input" type="number" min="1" value={form.price} onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))} required />
            </div>
            <div>
              <label className="form-label">Category</label>
              <select className="form-input" value={form.category} onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}>
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Material</label>
              <input className="form-input" value={form.material} onChange={(e) => setForm((prev) => ({ ...prev, material: e.target.value }))} />
            </div>
          </div>

          <div>
            <label className="form-label">Short description</label>
            <input className="form-input" value={form.shortDescription} onChange={(e) => setForm((prev) => ({ ...prev, shortDescription: e.target.value }))} required />
          </div>

          <div>
            <label className="form-label">Full description</label>
            <textarea className="form-input" rows="4" value={form.fullDescription} onChange={(e) => setForm((prev) => ({ ...prev, fullDescription: e.target.value }))} />
          </div>

          <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
            <div>
              <label className="form-label">Stock</label>
              <input className="form-input" type="number" min="0" value={form.stock} onChange={(e) => setForm((prev) => ({ ...prev, stock: e.target.value }))} />
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: "0.6rem", paddingTop: "1.35rem", color: "var(--text-mid)" }}>
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm((prev) => ({ ...prev, featured: e.target.checked }))} />
              Mark as featured
            </label>
          </div>

          <div>
            <label className="form-label">Upload photos (you can add more than one)</label>
            <input className="form-input" type="file" accept="image/*" multiple onChange={handleImageSelect} />
            <p style={{ marginTop: "0.45rem", color: "var(--text-light)", fontSize: "0.86rem" }}>Up to 6 photos per earring. The first photo will be the main image.</p>
          </div>

          {images.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "0.8rem" }}>
              {images.map((image, index) => (
                <div key={`${image}-${index}`} style={{ position: "relative", borderRadius: "12px", overflow: "hidden", border: "1px solid var(--border)" }}>
                  <img src={image} alt={`Preview ${index + 1}`} style={{ width: "100%", height: "120px", objectFit: "cover" }} />
                  <button type="button" onClick={() => removeImage(index)} style={{ position: "absolute", top: "0.35rem", right: "0.35rem", background: "rgba(61,43,31,0.75)", color: "#fff", borderRadius: "999px", width: "24px", height: "24px" }}>
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {message && <div style={{ padding: "0.8rem 1rem", borderRadius: "12px", background: message.includes("success") ? "#eaf8eb" : "#fff1e8", color: message.includes("success") ? "#276749" : "#a15617" }}>{message}</div>}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <button type="submit" className="btn btn-gold" disabled={loading}>
              {loading ? "Saving..." : "Publish Earring"}
            </button>
            <span style={{ color: "var(--text-light)" }}>{previewCount}/6 photos added</span>
          </div>
        </form>

        <div style={{ marginTop: "2rem", borderTop: "1px solid #eee", paddingTop: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div>
              <h2 style={{ margin: 0 }}>Manage current products</h2>
              <p style={{ margin: "0.3rem 0 0", color: "var(--text-mid)" }}>Delete sold items anytime from here.</p>
            </div>
            <span style={{ color: "var(--text-light)" }}>{products.length} product{products.length === 1 ? "" : "s"} listed</span>
          </div>

          {products.length === 0 ? (
            <div style={{ marginTop: "1rem", padding: "1rem", borderRadius: "12px", background: "#f7f4ed", color: "var(--text-mid)" }}>
              No products yet. Add your first earring above to start the storefront.
            </div>
          ) : (
            <div style={{ display: "grid", gap: "0.9rem", marginTop: "1rem" }}>
              {products.map((product) => (
                <div key={product.id} style={{ border: "1px solid var(--border)", borderRadius: "12px", padding: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                  <div>
                    <h3 style={{ margin: 0 }}>{product.name}</h3>
                    <p style={{ margin: "0.25rem 0 0", color: "var(--text-mid)" }}>
                      ID: {product.productId} • {product.category} • Stock: {product.stock}
                    </p>
                  </div>
                  <button type="button" onClick={() => handleDeleteProduct(product.id, product.name)} style={{ border: "none", borderRadius: "999px", background: "#b45309", color: "#fff", padding: "0.7rem 1rem", cursor: "pointer" }}>
                    Delete when sold
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <Link to="/" style={{ display: "inline-block", marginTop: "1.5rem", color: "#7a5f2a" }}>← Back to storefront</Link>
      </div>
    </div>
  );
}
