import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import OrderManagement from "@/components/OrderManagement";
import AddProductForm from "@/components/admin/AddProductForm";
import ProductList from "@/components/admin/ProductList";
import { Link } from "react-router-dom";
import { Home, ClipboardList, PlusCircle, ShoppingBag, Users, Settings } from "lucide-react";
import axios from "@/lib/axios";

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  rating?: number;
  discount?: number;
  description?: string;
  category?: string;
}

const AdminDashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<"orders" | "addProduct" | "viewProducts" | "users" | "settings">("orders");
  const { user, token } = useAuth();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleProductUpdate = () => {
    fetchProducts();
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name || 'Admin'}</p>
        </div>
        <Link to="/">
          <Button variant="outline" className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Back to Home
          </Button>
        </Link>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <Button
          variant={activeSection === "orders" ? "default" : "outline"}
          onClick={() => setActiveSection("orders")}
          className="flex items-center gap-2"
        >
          <ClipboardList className="h-5 w-5" />
          Order Management
        </Button>
        <Button
          variant={activeSection === "viewProducts" ? "default" : "outline"}
          onClick={() => setActiveSection("viewProducts")}
          className="flex items-center gap-2"
        >
          <ShoppingBag className="h-5 w-5" />
          Product Management
        </Button>
        <Button
          variant={activeSection === "addProduct" ? "default" : "outline"}
          onClick={() => setActiveSection("addProduct")}
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-5 w-5" />
          Add Product
        </Button>
        <Button
          variant={activeSection === "users" ? "default" : "outline"}
          onClick={() => setActiveSection("users")}
          className="flex items-center gap-2"
        >
          <Users className="h-5 w-5" />
          User Management
        </Button>
        <Button
          variant={activeSection === "settings" ? "default" : "outline"}
          onClick={() => setActiveSection("settings")}
          className="flex items-center gap-2"
        >
          <Settings className="h-5 w-5" />
          Settings
        </Button>
      </div>

      {/* Content Sections */}
      <div className="space-y-8">
        {activeSection === "orders" && (
          <div className="bg-card rounded-lg shadow-sm border p-6">
            <OrderManagement />
          </div>
        )}
        
        {activeSection === "viewProducts" && (
          <div className="bg-card rounded-lg shadow-sm border p-6">
            <ProductList products={products} onProductUpdate={handleProductUpdate} />
          </div>
        )}
        
        {activeSection === "addProduct" && (
          <div className="bg-card rounded-lg shadow-sm border p-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">Add New Product</h2>
            <AddProductForm onProductAdded={handleProductUpdate} />
          </div>
        )}
        
        {activeSection === "users" && (
          <div className="bg-card rounded-lg shadow-sm border p-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">User Management</h2>
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">User management features coming soon...</p>
            </div>
          </div>
        )}
        
        {activeSection === "settings" && (
          <div className="bg-card rounded-lg shadow-sm border p-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">Settings</h2>
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">Settings features coming soon...</p>
            </div>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;