"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AddToCartButton from "@/components/AddToCartButton";
import FooterSection from "@/components/FooterSection";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
}

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [localSearch, setLocalSearch] = useState("");
  
  const search = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const subcategory = searchParams.get("subcategory") || "";

  // Initialize local search from URL
  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  async function fetchProducts() {
    setLoading(true);
    
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (category) params.set("category", category);
    if (subcategory) params.set("subcategory", subcategory);

    try {
      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  // Debounced search update
  const updateSearch = useCallback(
    debounce((searchValue: string) => {
      const params = new URLSearchParams();
      if (searchValue) params.set("q", searchValue);
      if (category) params.set("category", category);
      if (subcategory) params.set("subcategory", subcategory);
      router.push(`/search?${params}`);
    }, 300),
    [category, subcategory, router]
  );

  function handleAllCategories() {
    router.push("/search");
  }

  function handleClearSearch() {
    setLocalSearch("");
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (subcategory) params.set("subcategory", subcategory);
    router.push(`/search?${params}`);
  }

  function handleBackToHome() {
    router.push("/");
  }

  return (
    <>
      <main className="p-8">
        <div className="max-w-6xl mx-auto">
          {/* Back button and header */}
          <div className="relative mb-8">
            <button
              onClick={handleBackToHome}
              className="win95-button px-4 py-2 inline-flex items-center gap-2 absolute left-0 top-1/2 transform -translate-y-1/2"
              >← Back to Home
            </button>
          <h1 className="text-2xl font-bold text-gray-900 text-center">Browse Products</h1>
          </div>
          
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleAllCategories}
                className="win95-button px-4 py-2"
              >
                All Categories
              </button>
              
              <div className="flex-1 relative">
                <input
                  type="search"
                  value={localSearch}
                  onChange={(e) => {
                    const value = e.target.value;
                    setLocalSearch(value);
                    updateSearch(value);
                  }}
                  placeholder="Search for products..."
                  className="w-full win95-button px-4 py-2 pl-10 pr-8"
                />
                
                {/* Clear button (X) when there's text */}
                {localSearch && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 bg-transparent p-1"
                    aria-label="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
            
            {/* Search info text */}
            {search && (
              <div className="mt-2 text-sm text-gray-600">
                Showing results for: <span className="font-semibold">"{search}"</span>
                <button
                  onClick={handleClearSearch}
                  className="ml-2 text-blue-600 hover:underline"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>

          {loading && products.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-xl font-bold">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-6">🔍</div>
              <p className="text-2xl font-bold mb-4">No products found</p>
              {search ? (
                <>
                  <p className="text-gray-600 mb-6">Try different search terms or browse all categories</p>
                  <button
                    onClick={handleClearSearch}
                    className="win95-button px-6 py-3 text-lg"
                  >
                    Clear search and show all products
                  </button>
                </>
              ) : (
                <p className="text-gray-600">Check back soon for new arrivals!</p>
              )}
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <p className="text-blue">
                  Found <span className="font-bold">{products.length}</span> product{products.length !== 1 ? 's' : ''}
                  {search && ` for "${search}"`}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => router.push("/cart")}
                    className="win95-button px-4 py-2 text-sm"
                  >
                    View Cart
                  </button>
                  <button
                    onClick={() => router.push("/orders")}
                    className="win95-button px-4 py-2 text-sm bg-blue-100 border-blue-300"
                  >
                    My Orders
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {products.map((product) => (
                  <div key={product._id} className="win95-card flex flex-col gap-2 text-sm hover:shadow-lg transition-shadow">
                    {product.imageUrl && (
                      <div className="relative overflow-hidden">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-28 object-cover border border-border-dark hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                          ${(product.price / 100).toFixed(2)}
                        </div>
                      </div>
                    )}
                    <div className="p-2 flex flex-col flex-grow">
                      <h2 className="font-bold leading-tight mb-1 line-clamp-2">{product.name}</h2>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                      <div className="mt-auto">
                        <AddToCartButton productId={product._id} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <FooterSection />
    </>
  );
}