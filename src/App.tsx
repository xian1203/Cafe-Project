import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import Index from "./pages/Index";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const routes = [
  {
    path: "/signin",
    element: <SignIn />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/",
    element: (
        <ProtectedRoute>
          <Index />
        </ProtectedRoute>
    ),
  },
  {
    path: "/checkout",
    element: (
        <ProtectedRoute>
          <Checkout />
        </ProtectedRoute>
    ),
  },
  {
    path: "/orders",
    element: (
        <ProtectedRoute>
          <Orders />
        </ProtectedRoute>
    ),
  },
  {
    path: "/admin",
    element: (
        <ProtectedRoute>
          <AdminDashboard />
        </ProtectedRoute>
    ),
  },
  {
    path: "/profile",
    element: (
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
    ),
  },
];

const router = createBrowserRouter(routes, {
  future: {
    v7_relativeSplatPath: true,
  },
});

const App = () => (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <TooltipProvider>
            <CartProvider>
              <Toaster />
              <Sonner />
            <RouterProvider router={router} />
            </CartProvider>
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
);

export default App;