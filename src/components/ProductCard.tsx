import { Star, Heart, ShoppingCart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  _id: string;
  name: string;
  price: number;
  image: string;
  rating?: number;
  discount?: number;
}

const ProductCard = ({ _id, name, price, image, rating = 0, discount = 0 }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userRating, setUserRating] = useState<number | null>(null);
  const [canRate, setCanRate] = useState(false);
  const [averageRating, setAverageRating] = useState(rating);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const formatPrice = (price?: number) => {
    const safePrice = typeof price === 'number' && !isNaN(price) ? price : 0;
    return `₱${safePrice.toFixed(2)}`;
  };

  const calculateDiscountedPrice = (originalPrice: number, discount: number) => {
    if (!discount) return originalPrice;
    const discountAmount = (originalPrice * discount) / 100;
    return originalPrice - discountAmount;
  };

  const handleBuyNow = () => {
    const discountedPrice = calculateDiscountedPrice(price, discount);
    addToCart({ _id, name, price: discountedPrice, image });
    navigate('/checkout');
    toast.success("Proceeding to checkout!");
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please log in to add items to cart');
      return;
    }

    setIsAddingToCart(true);
    try {
      const discountedPrice = calculateDiscountedPrice(price, discount);
      await addToCart({ _id, name, price: discountedPrice, image });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleRating = async (rating: number) => {
    if (!user || !canRate) return;

    try {
      // TODO: Implement rating functionality with backend
      setUserRating(rating);
      toast.success("Thank you for rating this product!");
    } catch (error) {
      console.error("Error saving rating:", error);
      toast.error("Failed to save your rating. Please try again.");
    }
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  // Ensure averageRating is always a number
  const displayRating = averageRating || 0;
  const discountedPrice = calculateDiscountedPrice(price, discount);

  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden border border-gray-100 dark:border-gray-700">
      {/* Discount Badge */}
      {discount > 0 && (
        <Badge className="absolute top-3 left-3 z-10 bg-red-500 hover:bg-red-600 text-white border-0 animate-pulse">
          -{discount}% OFF
        </Badge>
      )}

      {/* Wishlist Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-50 dark:hover:bg-red-900/20"
        onClick={toggleWishlist}
      >
        <Heart 
          className={`h-4 w-4 transition-all duration-300 ${
            isWishlisted 
              ? "fill-red-500 text-red-500 scale-110" 
              : "text-gray-600 dark:text-gray-400"
          }`} 
        />
      </Button>

      {/* Product Image */}
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Product Info */}
      <div className="p-6 space-y-4">
        {/* Product Name */}
        <h3 className="font-semibold text-lg line-clamp-2 text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
          {name}
        </h3>
        
        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 cursor-${canRate ? 'pointer' : 'default'} transition-all duration-200 ${
                  (hoverRating !== null ? i < hoverRating : i < (userRating || displayRating))
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300 dark:text-gray-600"
                }`}
                onClick={() => canRate && handleRating(i + 1)}
                onMouseEnter={() => canRate && setHoverRating(i + 1)}
                onMouseLeave={() => setHoverRating(null)}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            ({displayRating.toFixed(1)})
          </span>
        </div>

        {/* Price */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-green-600 dark:text-green-400">
              {formatPrice(discountedPrice)}
            </span>
            {discount > 0 && (
              <span className="text-sm text-gray-500 line-through dark:text-gray-400">
                {formatPrice(price)}
              </span>
            )}
          </div>
          {discount > 0 && (
            <p className="text-sm text-green-600 dark:text-green-400 font-medium">
              You save ₱{(price - discountedPrice).toFixed(2)}!
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <Button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white transition-all duration-300 group/btn"
          >
            {isAddingToCart ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Adding...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 group-hover/btn:scale-110 transition-transform duration-200" />
                Add to Cart
              </div>
            )}
          </Button>

          <Button
            onClick={handleBuyNow}
            variant="outline"
            className="w-full border-green-600 text-green-600 hover:bg-green-50 dark:border-green-400 dark:text-green-400 dark:hover:bg-green-900/20 transition-all duration-300 group/btn"
          >
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 group-hover/btn:scale-110 transition-transform duration-200" />
              Buy Now
            </div>
          </Button>
        </div>

        {/* Rating Eligibility */}
        {user && !canRate && !userRating && (
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center pt-2 border-t border-gray-100 dark:border-gray-700">
            Purchase and receive this item to rate it
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;