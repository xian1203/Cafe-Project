import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import OrderCard from "@/components/orders/OrderCard";
import { toast } from "sonner";
import axios from "@/lib/axios";

interface OrderItem {
  product: {
    _id: string;
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  user: string;
  items: OrderItem[];
  total: number;
  status: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    description: string;
    fullName: string;
  };
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
  remainingTime?: number;
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPreviousOrders, setShowPreviousOrders] = useState(false);
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const calculateRemainingTime = (createdAt: string) => {
    const orderTime = new Date(createdAt).getTime();
    const currentTime = Date.now();
    const timeDifference = 180000 - (currentTime - orderTime); // 3 minutes in milliseconds
    return timeDifference > 0 ? timeDifference : 0;
  };

  const cancelOrder = async (orderId: string, createdAt: string) => {
    const remainingTime = calculateRemainingTime(createdAt);

    if (remainingTime <= 0) {
      toast.error("You can no longer cancel this order.");
      return;
    }

    try {
      await axios.put(`/orders/${orderId}/cancel`);
      toast.success("Order cancelled successfully.");
      // Refresh orders after cancellation
      fetchOrders();
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Failed to cancel order. Please try again.");
    }
  };

  const fetchOrders = async () => {
    if (!user || !token) return;

    try {
      setLoading(true);
      const response = await axios.get('/orders');
      const ordersData = response.data;

      const processedOrders = ordersData
        .map((order: Order) => ({
          ...order,
          remainingTime: calculateRemainingTime(order.createdAt),
          }))
        .filter((order: Order) =>
            showPreviousOrders
            ? order.status === "delivered" || order.status === "cancelled"
            : order.status !== "delivered" && order.status !== "cancelled"
          )
        .sort((a: Order, b: Order) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setOrders(processedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
        setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user, token, showPreviousOrders]);

  useEffect(() => {
    const interval = setInterval(() => {
      setOrders((prevOrders) =>
        prevOrders.map((order) => ({
          ...order,
          remainingTime: calculateRemainingTime(order.createdAt),
        }))
      );
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading orders...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold dark:text-white">Your Orders</h1>
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <Home className="h-5 w-5" />
            Back to Home
          </Button>
        </div>

        <div className="flex justify-end mb-4">
          <Button
            variant="outline"
            onClick={() => setShowPreviousOrders(!showPreviousOrders)}
            className="flex items-center gap-2"
          >
            {showPreviousOrders ? "View Active Orders" : "View Previous Orders"}
          </Button>
        </div>

        {orders.length === 0 ? (
          <div className="text-center">
            <p className="text-xl mb-4 dark:text-white">
              {showPreviousOrders ? "No previous orders found" : "No active orders found"}
            </p>
            <Button onClick={() => navigate("/")} className="bg-amazon-orange hover:bg-amazon-hover text-black">
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="border rounded-lg p-4 shadow-md">
                <OrderCard order={order} />
                {order.status === "processing" && (
                  <>
                    {order.remainingTime && order.remainingTime > 0 ? (
                      <div className="text-sm text-gray-600 mb-2">
                        Time left to cancel: {Math.floor(order.remainingTime / 1000)} seconds
                      </div>
                    ) : (
                      <div className="text-sm text-red-600 mb-2">Cancellation period expired</div>
                    )}
                    <Button
                      variant="destructive"
                      onClick={() => cancelOrder(order._id, order.createdAt)}
                      className="mt-4 w-full"
                      disabled={!order.remainingTime || order.remainingTime <= 0}
                    >
                      Cancel Order
                    </Button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;