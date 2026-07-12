import React, { createContext, useContext, useState, useEffect } from "react";
import { SEED_PRODUCTS } from "../data/products";
import { hasSupabaseConfig, supabase, supabaseProductsTable } from "../lib/supabaseClient";

const STORAGE_KEY = "sharaaya_products";

const ProductContext = createContext(null);

const normalizeProducts = (items) => {
  if (!Array.isArray(items)) return [];
  return items
    .filter(Boolean)
    .map((product) => {
      const createdAtValue = product.createdAt ?? product.created_at ?? Date.now();
      const normalized = {
        ...product,
        id: product.id ?? product.product_id ?? `p_${Date.now()}_${Math.random()}`,
        productId: product.productId ?? product.product_id ?? "",
        name: product.name ?? "Untitled Earring",
        price: Number(product.price ?? 0),
        category: product.category ?? "casual",
        material: product.material ?? "",
        shortDescription: product.shortDescription ?? "",
        fullDescription: product.fullDescription ?? "",
        images: Array.isArray(product.images) ? product.images : [],
        stock: Number(product.stock ?? 0),
        inStock: Boolean(product.inStock ?? Number(product.stock ?? 0) > 0),
        featured: Boolean(product.featured),
        createdAt:
          typeof createdAtValue === "number"
            ? createdAtValue
            : Date.parse(createdAtValue) || Date.now(),
      };
      return normalized;
    })
    .filter((product) => product && product.id && product.name);
};

const readStoredProducts = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return normalizeProducts(parsed);
    }
  } catch (_) {}
  return SEED_PRODUCTS;
};

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(readStoredProducts);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch (error) {
      console.warn("Unable to persist products to localStorage", error);
    }
  }, [products]);

  useEffect(() => {
    const loadRemoteProducts = async () => {
      if (!hasSupabaseConfig || !supabase) return;

      try {
        let { data, error } = await supabase
          .from(supabaseProductsTable)
          .select("*")
          .order("createdAt", { ascending: false });

        if (error && error.code === "42703") {
          ({ data, error } = await supabase
            .from(supabaseProductsTable)
            .select("*")
            .order("created_at", { ascending: false }));
        }

        if (error) throw error;

        const remoteProducts = normalizeProducts(data || []);
        if (remoteProducts.length) {
          setProducts(remoteProducts);
        }
      } catch (error) {
        console.error("Failed to load products from Supabase", error);
      }
    };

    loadRemoteProducts();
  }, []);

  // ── CRUD ────────────────────────────────────────────────────────────────
  const addProduct = async (product) => {
    const newProduct = {
      ...product,
      id: `p_${Date.now()}`,
      createdAt: Date.now(),
      inStock: Number(product.stock) > 0,
    };

    setProducts((prev) => [newProduct, ...prev]);

    if (!hasSupabaseConfig || !supabase) return newProduct;

    try {
      const payload = {
        id: newProduct.id,
        productId: product.productId,
        name: product.name,
        price: Number(product.price),
        category: product.category,
        material: product.material,
        shortDescription: product.shortDescription,
        fullDescription: product.fullDescription,
        images: product.images ?? [],
        stock: Number(product.stock) || 0,
        inStock: Number(product.stock) > 0,
        featured: Boolean(product.featured),
        createdAt: new Date(newProduct.createdAt).toISOString(),
      };

      const { data, error } = await supabase
        .from(supabaseProductsTable)
        .insert([payload])
        .select()
        .single();

      if (error) throw error;

      const savedProduct = normalizeProducts([data])[0];
      if (savedProduct) {
        setProducts((prev) => [savedProduct, ...prev.filter((item) => item.id !== newProduct.id)]);
        return savedProduct;
      }
      return newProduct;
    } catch (error) {
      console.error("Failed to save product to Supabase", error);
      return newProduct;
    }
  };

  const updateProduct = async (id, updates) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));

    if (!hasSupabaseConfig || !supabase) return;

    try {
      await supabase.from(supabaseProductsTable).update(updates).eq("id", id);
    } catch (error) {
      console.error("Failed to update product in Supabase", error);
    }
  };

  const deleteProduct = async (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));

    if (!hasSupabaseConfig || !supabase) return;

    try {
      await supabase.from(supabaseProductsTable).delete().eq("id", id);
    } catch (error) {
      console.error("Failed to delete product from Supabase", error);
    }
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
