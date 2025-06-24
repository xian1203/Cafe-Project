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
import { ArrowLeft } from "lucide-react";
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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Checkout</h1>
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
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
              <p className="font-bold">₱{item.price * item.quantity}</p>
            </div>
          ))}
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold">Total:</span>
              <span className="text-lg font-bold">₱{total}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Delivery Information</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium mb-1">
                Full Name
              </label>
              <Input
                id="fullName"
                required
                value={address.fullName || ""}
                onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                placeholder="Full Name"
              />
            </div>
            <div>
              <label htmlFor="street" className="block text-sm font-medium mb-1">
                Street Address
              </label>
              <Input
                id="street"
                required
                value={address.street}
                onChange={(e) => setAddress({ ...address, street: e.target.value })}
                placeholder="1234 Main St"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">
                Description
              </label>
              <Input
                id="description"
                value={address.description || ""}
                onChange={(e) => setAddress({ ...address, description: e.target.value })}
                placeholder="Additional details about the delivery"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email/Username
              </label>
              <Input
                id="email"
                value={user?.email || user?.username || ""}
                readOnly
                className="bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="mt-6 space-y-6">
            <h2 className="text-xl font-semibold">Payment Method</h2>
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