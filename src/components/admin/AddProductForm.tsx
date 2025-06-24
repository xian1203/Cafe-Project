import { useState } from "react";
import API from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import axios from "@/lib/axios";

// TODO: Replace Firebase logic with backend API calls

interface Product {
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  rating?: number;
  discount?: number;
}

interface AddProductFormProps {
  onProductAdded?: () => void;
}

const AddProductForm: React.FC<AddProductFormProps> = ({ onProductAdded }) => {
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: "",
    description: "",
    price: 0,
    category: "",
    image: "",
    rating: 5,
    discount: 0,
  });
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const categories = [
    "Burgers",
    "Pizza",
    "Pasta",
    "Salads",
    "Desserts",
    "Beverages",
    "Appetizers",
    "Sides",
    "Breakfast",
    "Lunch",
    "Dinner"
  ];

  const handleImageUrlChange = (url: string) => {
    setNewProduct({ ...newProduct, image: url });
    
    // Validate and preview image
    if (url) {
      const img = new Image();
      img.onload = () => {
        setImagePreview(url);
      };
      img.onerror = () => {
        setImagePreview(null);
        toast.error("Invalid image URL");
      };
      img.src = url;
    } else {
      setImagePreview(null);
    }
  };

  const validateForm = () => {
    if (!newProduct.name?.trim()) {
      toast.error("Product name is required");
      return false;
    }
    if (!newProduct.description?.trim()) {
      toast.error("Product description is required");
      return false;
    }
    if (!newProduct.price || newProduct.price <= 0) {
      toast.error("Price must be greater than 0");
      return false;
    }
    if (!newProduct.category) {
      toast.error("Please select a category");
      return false;
    }
    if (!newProduct.image?.trim()) {
      toast.error("Image URL is required");
      return false;
    }
    return true;
  };

  const handleAddProduct = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      const productData = {
        name: newProduct.name?.trim(),
        description: newProduct.description?.trim(),
        price: Number(newProduct.price),
        category: newProduct.category,
        image: newProduct.image?.trim(),
        rating: newProduct.rating || 5,
        discount: newProduct.discount || 0,
      };

      await API.post('/products', productData);

      // Reset form
      setNewProduct({
        name: "",
        description: "",
        price: 0,
        category: "",
        image: "",
        rating: 5,
        discount: 0,
      });
      setImagePreview(null);
      
      toast.success("Product added successfully!");
      if (onProductAdded) onProductAdded();
    } catch (error: unknown) {
      console.error("Error adding product:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to add product";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100 text-center">
        Add New Product
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="productName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Product Name *
          </label>
          <Input
            id="productName"
            placeholder="Enter product name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg"
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Price (₱) *
          </label>
          <Input
            id="price"
            type="number"
            min="0"
            step="0.01"
            placeholder="Enter price"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
            className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category *
          </label>
          <Select value={newProduct.category} onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}>
            <SelectTrigger className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label htmlFor="discount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Discount (%)
          </label>
          <Input
            id="discount"
            type="number"
            min="0"
            max="100"
            placeholder="Enter discount percentage"
            value={newProduct.discount}
            onChange={(e) => setNewProduct({ ...newProduct, discount: Number(e.target.value) })}
            className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Image URL *
          </label>
          <Input
            id="imageUrl"
            type="url"
            placeholder="https://example.com/image.jpg"
            value={newProduct.image}
            onChange={(e) => handleImageUrlChange(e.target.value)}
            className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg"
          />
          {imagePreview && (
            <div className="mt-2">
              <p className="text-sm text-green-600 mb-2">✓ Image preview:</p>
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                onError={() => setImagePreview(null)}
              />
            </div>
          )}
          
          {/* Sample Image URLs Helper */}
          <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              💡 Quick image URLs (click to use):
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=400&fit=crop", // Pizza
                "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop", // Burger
                "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&h=400&fit=crop", // Pasta
                "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=400&fit=crop", // Salad
                "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=400&fit=crop"  // Dessert
              ].map((url, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleImageUrlChange(url)}
                  className="text-xs bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-800 dark:text-blue-200 px-2 py-1 rounded"
                >
                  {["Pizza", "Burger", "Pasta", "Salad", "Dessert"][index]}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description *
          </label>
          <Textarea
            id="description"
            placeholder="Enter product description"
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg min-h-[100px]"
          />
        </div>
      </div>

      <Button
        onClick={handleAddProduct}
        disabled={loading}
        className="mt-6 w-full bg-green-600 hover:bg-green-500 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg shadow-md transition-all duration-200"
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="loading-dots">
              <div></div>
              <div></div>
              <div></div>
            </div>
            <span className="ml-2">Adding Product...</span>
          </div>
        ) : (
          "Add Product"
        )}
      </Button>
    </div>
  );
};

export default AddProductForm;