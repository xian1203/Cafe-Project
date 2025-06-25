import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import CartSidebar from "@/components/CartSidebar";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Search, Filter, Coffee, Sparkles, Star, X } from "lucide-react";
import API from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// TODO: Replace Firebase logic with backend API calls

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  rating?: number;
  discount?: number;
  category?: string;
  description?: string;
}

const Index = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    setLoading(true);
    API.get('/products')
      .then(res => {
        // Add default rating if not present
        const productsWithRating = res.data.map((product: Product) => ({
          ...product,
          rating: product.rating || 0
        }));
        setProducts(productsWithRating);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        toast.error('Failed to load products');
        setLoading(false);
      });
  }, []);

  // Get unique categories
  const categories = ["all", ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];

  // Filter and sort products
  const filteredAndSortedProducts = products
    .filter(product => {
      const matchesSearch = (product.name || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    // Show newest products first (assuming backend order is oldest-first)
    .reverse()
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "name":
        default:
          return (a.name || '').localeCompare(b.name || '');
      }
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Navbar onCartClick={() => setIsCartOpen(true)} />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Coffee className="h-8 w-8 text-green-600 dark:text-green-400" />
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                Whispering Leaves
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Discover the finest coffee and tea selections, crafted with passion and delivered with care
            </p>
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-medium">4.8/5</span>
              </div>
              <div className="w-px h-4 bg-gray-300 dark:bg-gray-600" />
              <div className="flex items-center gap-1">
                <Sparkles className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Premium Quality</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-green-200 dark:bg-green-800 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-20 right-20 w-16 h-16 bg-green-300 dark:bg-green-700 rounded-full opacity-30 animate-bounce" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-10 left-20 w-12 h-12 bg-green-400 dark:bg-green-600 rounded-full opacity-25 animate-bounce" style={{ animationDelay: '2s' }}></div>
      </section>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-6">
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search for your favorite coffee or tea..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 h-12 text-lg border-2 border-gray-200 dark:border-gray-700 focus:border-green-500 dark:focus:border-green-400 transition-colors duration-200"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Category:</span>
              <div className="flex gap-2">
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    className={`cursor-pointer transition-all duration-200 ${
                      selectedCategory === category 
                        ? "bg-green-600 hover:bg-green-700" 
                        : "hover:bg-green-50 dark:hover:bg-green-900/20"
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:border-green-500 dark:focus:border-green-400 transition-colors duration-200"
              >
                <option value="name">Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            {filteredAndSortedProducts.length} product{filteredAndSortedProducts.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading amazing products...</p>
            </div>
          </div>
        ) : filteredAndSortedProducts.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <div className="w-24 h-24 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {searchQuery ? "No products found" : "No products available"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchQuery 
                  ? "Try adjusting your search terms or browse all categories" 
                  : "Check back soon for new arrivals!"
                }
              </p>
            </div>
            {searchQuery && (
              <Button 
                onClick={() => setSearchQuery("")}
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-50 dark:border-green-400 dark:text-green-400 dark:hover:bg-green-900/20"
              >
                Clear Search
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedProducts.map((product, idx) => (
              <div
                key={product._id}
                className={
                  idx === 0
                    ? "relative animate-[slideIn_0.8s_ease-out] shadow-[0_0_16px_4px_rgba(34,197,94,0.3)] z-10 cursor-pointer"
                    : "cursor-pointer"
                }
                style={idx === 0 ? { animationName: 'slideIn', animationDuration: '0.8s', animationTimingFunction: 'ease-out' } : {}}
                onClick={() => setSelectedProduct(product)}
              >
                <ProductCard {...product} />
                {idx === 0 && (
                  <span className="absolute top-2 right-2 bg-green-600 text-white text-xs px-3 py-1 rounded-full shadow animate-pulse">LIVE</span>
                )}
              </div>
            ))}
          </div>
        )}
        {/* Product Details Modal */}
        {selectedProduct && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setSelectedProduct(null)}
          >
            <div
              className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-lg w-full animate-zoom-in"
              style={{ animation: 'zoomIn 0.4s cubic-bezier(0.4,0,0.2,1)' }}
              onClick={e => e.stopPropagation()}
            >
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors"
                onClick={() => setSelectedProduct(null)}
                aria-label="Close"
              >
                <X className="h-6 w-6" />
              </button>
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-64 object-cover rounded-xl mb-6 shadow-lg"
              />
              <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{selectedProduct.name}</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">{selectedProduct.description || "No description available."}</p>
              <div className="flex items-center gap-4">
                <span className="text-xl font-bold text-green-600 dark:text-green-400">₱{selectedProduct.price.toFixed(2)}</span>
                {selectedProduct.rating && (
                  <span className="flex items-center gap-1 text-yellow-500 font-medium">
                    <Star className="h-5 w-5" /> {selectedProduct.rating.toFixed(1)}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

// Add keyframes for zoomIn and fadeIn
const style = document.createElement('style');
style.innerHTML = `
@keyframes zoomIn {
  0% { transform: scale(0.7); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}`;
document.head.appendChild(style);

export default Index;