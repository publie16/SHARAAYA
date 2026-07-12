import React, { createContext, useContext, useState, useEffect } from "react";
import { SEED_PRODUCTS } from "../data/products";
import { hasSupabaseConfig, supabase, supabaseProductsTable } from "../lib/supabaseClient";

const DEBUG_PRODUCT_LOAD = import.meta.env.DEV;

const STORAGE_KEY = "sharaaya_products";

const ProductContext = createContext(null);
const COMMON_TABLE_NAMES = ["products", "product", "earrings", "sharaaya_products"];

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
      if (!hasSupabaseConfig || !supabase) {
        console.warn("Supabase config not available; skipping remote product fetch.");
        return;
      }

      const tableCandidates = [supabaseProductsTable, ...COMMON_TABLE_NAMES.filter((name) => name !== supabaseProductsTable)];

      for (const tableName of tableCandidates) {
        try {
          const { data, error } = await supabase.from(tableName).select("*");
          if (error) {
            if (error.code === "42P01" || error.code === "PGRST116" || error.message?.includes("does not exist")) {
              continue;
            }
            console.warn(`Supabase query failed for table ${tableName}`, error);
            continue;
          }

          const remoteProducts = normalizeProducts(data || []);
          if (DEBUG_PRODUCT_LOAD) {
            console.info("Supabase products fetched", { tableName, data, remoteProducts });
          }
          if (remoteProducts.length) {
            const sortedProducts = [...remoteProducts].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
            setProducts(sortedProducts);
            return;
          }
        } catch (error) {
          console.warn(`Supabase fetch failed for table ${tableName}`, error);
        }
      }

      console.warn("No products found in Supabase for the configured tables.");
      if (!DEBUG_PRODUCT_LOAD) {
        window.dispatchEvent(new CustomEvent("sharaaya:supabase-load-empty"));
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

    if (!hasSupabaseConfig || !supabase) {
      setProducts((prev) => [newProduct, ...prev]);
      return newProduct;
    }

    try {
      const payload = {
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
      };

      const { data, error } = await supabase
        .from(supabaseProductsTable)
        .insert([payload])
        .select()
        .single();

      if (error) {
        console.error("Failed to save product to Supabase", error);
        throw error;
      }

      const savedProduct = normalizeProducts([data])[0];
      if (savedProduct) {
        setProducts((prev) => [savedProduct, ...prev]);
        return savedProduct;
      }

      setProducts((prev) => [newProduct, ...prev]);
      return newProduct;
    } catch (error) {
      console.error("Failed to save product to Supabase", error);
      throw error;
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
