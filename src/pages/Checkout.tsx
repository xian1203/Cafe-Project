import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import PayPalButton from "@/components/PayPalButton";
import GCashButton from "@/components/GCashButton";
import CashPaymentButton from "@/components/CashPaymentButton";
import { ArrowLeft, Home, MapPin, Mail, User as UserIcon, FileText } from "lucide-react";
import SuccessNotification from "../components/SuccessNotification";
import axios from "@/lib/axios";

const Modal = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md text-center">
        {children}
      </div>
    </div>
  );
};

const Checkout = () => {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    description: "",
    fullName: "",
  });
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);

  const handleOrderSuccess = async (paymentMethod: string) => {
    try {
      setIsProcessing(true);
      
      const orderData = {
        items: items.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.price
        })),
        total,
        address,
        paymentMethod,
        paymentStatus: "completed"
      };

      await axios.post('/orders', orderData);

      clearCart();
      setShowSuccessNotification(true);
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Failed to create order");
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <Button onClick={() => navigate("/")} className="bg-amazon-orange hover:bg-amazon-hover text-black">
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 flex items-center justify-center">
      <div className="w-full max-w-3xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <Home className="h-8 w-8 text-green-600 dark:text-green-400 animate-bounce" />
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">Checkout</h1>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 mb-8 animate-fade-in">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100 text-center">Order Summary</h2>
          {items.map((item) => (
            <div key={item.product._id} className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-4">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <h3 className="font-medium">{item.product.name}</h3>
                  <p className="text-gray-600">Quantity: {item.quantity}</p>
                </div>
              </div>
              <p className="text-lg font-bold">₱{item.price * item.quantity}</p>
            </div>
          ))}
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold">Total:</span>
              <span className="text-lg font-bold">₱{total}</span>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 animate-fade-in">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100 text-center">Delivery Information</h2>
          <div className="space-y-4">
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                id="fullName"
                required
                value={address.fullName || ""}
                onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                placeholder="Full Name"
                className="pl-10 text-lg py-3 w-full text-gray-900 dark:text-gray-100 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-green-500 dark:focus:border-green-400 transition-colors duration-200"
                style={{ color: 'black' }}
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                id="street"
                required
                value={address.street}
                onChange={(e) => setAddress({ ...address, street: e.target.value })}
                placeholder="1234 Main St"
                className="pl-10 text-lg py-3 w-full text-gray-900 dark:text-gray-100 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-green-500 dark:focus:border-green-400 transition-colors duration-200"
                style={{ color: 'black' }}
              />
            </div>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                id="description"
                value={address.description || ""}
                onChange={(e) => setAddress({ ...address, description: e.target.value })}
                placeholder="Additional details about the delivery"
                className="pl-10 text-lg py-3 w-full text-gray-900 dark:text-gray-100 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-green-500 dark:focus:border-green-400 transition-colors duration-200"
                style={{ color: 'black' }}
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                id="email"
                value={user?.email || user?.username || ""}
                readOnly
                className="pl-10 text-lg py-3 w-full bg-gray-100 cursor-not-allowed text-gray-900 dark:text-gray-100 rounded-xl border-2 border-gray-200 dark:border-gray-700"
                style={{ color: 'black' }}
              />
            </div>
          </div>
          <div className="mt-8 space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 text-center">Payment Method</h2>
            <div className="space-y-4">
              <PayPalButton 
                amount={total} 
                onSuccess={() => handleOrderSuccess('PayPal')} 
              />
              <GCashButton 
                amount={total} 
                onSuccess={() => handleOrderSuccess('GCash')} 
              />
              <CashPaymentButton 
                amount={total} 
                onSuccess={() => handleOrderSuccess('Cash')} 
              />
            </div>
          </div>
        </div>
      </div>
      {showSuccessNotification && (
        <SuccessNotification
          onViewStatus={() => {
            setShowSuccessNotification(false);
            navigate("/orders");
          }}
          onDismiss={() => setShowSuccessNotification(false)}
        />
      )}
    </div>
  );
};

export default Checkout;