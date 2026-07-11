import React, { createContext, useContext, useState, useEffect } from "react";
import { SEED_PRODUCTS } from "../data/products";

const STORAGE_KEY = "sharaaya_products";

const ProductContext = createContext(null);

const normalizeProducts = (items) => {
  if (!Array.isArray(items)) return [];
  return items.filter(
    (product) =>
      product &&
      product.id &&
      product.name &&
      product.createdAt &&
      product.productId
  );
};

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return normalizeProducts(parsed);
      }
    } catch (_) {}
    return SEED_PRODUCTS;
  });

  // Persist every change to localStorage immediately
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch (error) {
      console.warn("Unable to persist products to localStorage", error);
    }
  }, [products]);

  // ── CRUD ────────────────────────────────────────────────────────────────
  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: `p_${Date.now()}`,
      createdAt: Date.now(),
    };
    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = (id, updates) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // ── Derived helpers ──────────────────────────────────────────────────────
  const getProductById = (id) => products.find((p) => p.id === id);

  const getProductsByCategory = (catId) =>
    products.filter((p) => p.category === catId);

  const getFeatured = () => products.filter((p) => p.featured && p.inStock);

  const searchProducts = (query, filters = {}) => {
    let result = [...products];
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.material.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q)
      );
    }
    if (filters.category && filters.category !== "all") {
      result = result.filter((p) => p.category === filters.category);
    }
    if (filters.priceMax) {
      result = result.filter((p) => p.price <= filters.priceMax);
    }
    if (filters.material) {
      result = result.filter((p) =>
        p.material.toLowerCase().includes(filters.material.toLowerCase())
      );
    }
    return result;
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductById,
        getProductsByCategory,
        getFeatured,
        searchProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export const useProducts = () => {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error("useProducts must be used within ProductProvider");
  return ctx;
};
