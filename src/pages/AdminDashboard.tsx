import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import OrderManagement from "@/components/OrderManagement";
import AddProductForm from "@/components/admin/AddProductForm";
import ProductList from "@/components/admin/ProductList";
import { Link } from "react-router-dom";
import { Home, ClipboardList, PlusCircle, ShoppingBag, Users, Settings, RefreshCw, Trash2, Save, KeyRound } from "lucide-react";
import axios from "@/lib/axios";
import { toast } from "sonner";

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

interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  role: string;
}

const AdminDashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(false);
  const [activeSection, setActiveSection] = useState<"orders" | "addProduct" | "viewProducts" | "users" | "settings">("orders");
  const { user, token } = useAuth();
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || ""
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

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

  const fetchUsers = async () => {
    try {
      setUserLoading(true);
      const response = await axios.get('/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setUserLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (activeSection === "users") fetchUsers();
    // eslint-disable-next-line
  }, [activeSection]);

  useEffect(() => {
    setProfileForm({ name: user?.name || "", email: user?.email || "" });
  }, [user]);

  const handleProductUpdate = () => {
    fetchProducts();
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    setDeletingUserId(userId);
    try {
      await axios.delete(`/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      toast.error("Failed to delete user");
    } finally {
      setDeletingUserId(null);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      await axios.put(
        "/users/profile",
        { name: profileForm.name, email: profileForm.email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    setPasswordLoading(true);
    try {
      await axios.put(
        "/users/change-password",
        {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Password updated successfully");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error: unknown) {
      if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response &&
        error.response.data &&
        typeof error.response.data === "object" &&
        "error" in error.response.data
      ) {
        // @ts-expect-error: error type from axios may not be inferred correctly
        toast.error(error.response.data.error || "Failed to update password");
      } else {
        toast.error("Failed to update password");
      }
    } finally {
      setPasswordLoading(false);
    }
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
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Users className="h-6 w-6" /> User Management
              <button onClick={fetchUsers} className="ml-auto p-2 rounded hover:bg-muted transition-colors" title="Refresh">
                <RefreshCw className={userLoading ? "animate-spin" : ""} />
              </button>
            </h2>
            {userLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : users.length === 0 ? (
            <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No users found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {users.map((u) => (
                      <tr key={u._id}>
                        <td className="px-4 py-2 whitespace-nowrap font-medium">{u.name}</td>
                        <td className="px-4 py-2 whitespace-nowrap">{u.username}</td>
                        <td className="px-4 py-2 whitespace-nowrap">{u.email}</td>
                        <td className="px-4 py-2 whitespace-nowrap capitalize">{u.role}</td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <button
                            onClick={() => handleDeleteUser(u._id)}
                            className="p-2 rounded hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
                            disabled={deletingUserId === u._id}
                            title="Delete user"
                          >
                            {deletingUserId === u._id ? (
                              <span className="animate-spin inline-block align-middle"><Trash2 className="h-5 w-5" /></span>
                            ) : (
                              <Trash2 className="h-5 w-5" />
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            </div>
            )}
          </div>
        )}
        
        {activeSection === "settings" && (
          <div className="bg-card rounded-lg shadow-sm border p-6">
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Settings className="h-6 w-6" /> Settings
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Profile Update Form */}
              <form onSubmit={handleProfileUpdate} className="space-y-4 bg-muted/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><Save className="h-5 w-5" /> Update Profile</h3>
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={e => setProfileForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full border rounded px-3 py-2 text-gray-900 dark:text-gray-100 bg-background"
                    required
                    style={{ color: 'black' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={e => setProfileForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full border rounded px-3 py-2 text-gray-900 dark:text-gray-100 bg-background"
                    required
                    style={{ color: 'black' }}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                  disabled={profileLoading}
                >
                  {profileLoading ? <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span> : <Save className="h-5 w-5" />}
                  Save Changes
                </button>
              </form>
              {/* Password Change Form */}
              <form onSubmit={handlePasswordChange} className="space-y-4 bg-muted/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><KeyRound className="h-5 w-5" /> Change Password</h3>
                <div>
                  <label className="block text-sm font-medium mb-1">Current Password</label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={e => setPasswordForm(f => ({ ...f, currentPassword: e.target.value }))}
                    className="w-full border rounded px-3 py-2 text-gray-900 dark:text-gray-100 bg-background"
                    required
                    style={{ color: 'black' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">New Password</label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={e => setPasswordForm(f => ({ ...f, newPassword: e.target.value }))}
                    className="w-full border rounded px-3 py-2 text-gray-900 dark:text-gray-100 bg-background"
                    required
                    style={{ color: 'black' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={e => setPasswordForm(f => ({ ...f, confirmPassword: e.target.value }))}
                    className="w-full border rounded px-3 py-2 text-gray-900 dark:text-gray-100 bg-background"
                    required
                    style={{ color: 'black' }}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                  disabled={passwordLoading}
                >
                  {passwordLoading ? <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span> : <KeyRound className="h-5 w-5" />}
                  Change Password
                </button>
              </form>
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