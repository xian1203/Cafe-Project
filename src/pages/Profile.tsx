import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeSelector } from "@/components/ThemeToggle";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Calendar, Shield } from "lucide-react";

const Profile = () => {
  const { user, token, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token && !loading) {
      navigate("/signin");
    }
  }, [token, loading, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading-dots">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  }
  
  if (!user) return null;

  const getUserInitials = () => {
    if (!user) return "U";
    return user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : user.username?.charAt(0).toUpperCase() || "U";
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Profile Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Information Card */}
        <Card className="bg-white dark:bg-gray-800 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-green-600" />
              User Information
            </CardTitle>
            <CardDescription>
              Your account details and information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 text-lg font-medium">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">{user.name || user.username}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{user.role}</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Username</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{user.username}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Role</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{user.role}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">User ID</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">{user._id}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Theme Settings Card */}
        <Card className="bg-white dark:bg-gray-800 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
              Appearance
            </CardTitle>
            <CardDescription>
              Customize how the application looks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ThemeSelector />
          </CardContent>
        </Card>
      </div>

      {/* Additional Settings */}
      <Card className="bg-white dark:bg-gray-800 shadow-lg">
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>
            Manage your account preferences and security
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Password</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Update your password to keep your account secure
              </p>
              <button className="text-sm text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300">
                Change Password
              </button>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Notifications</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Manage your notification preferences
              </p>
              <button className="text-sm text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300">
                Configure Notifications
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
