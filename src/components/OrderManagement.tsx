import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { toast } from "sonner";
import { CalendarIcon } from "lucide-react";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";
import axios from "@/lib/axios";

interface Order {
  _id: string;
  userId: string;
  user?: {
    name: string;
    email: string;
    username: string;
  };
  items: Array<{
    product: {
      _id: string;
      name: string;
      price: number;
      image: string;
    };
    quantity: number;
    price: number;
  }>;
  total: number;
  status: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    fullName: string;
  };
  createdAt: string;
  estimatedDeliveryDate: string;
  actualDeliveryDate: string | null;
}

const OrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedOrderKey, setSelectedOrderKey] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/orders');
      console.log('Admin orders data received:', response.data);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await axios.patch(`/api/orders/${orderId}`, { status: newStatus });
      toast.success("Order status updated successfully");
      fetchOrders(); // Refresh the orders list
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    }
  };

  const updateDeliveryDateTime = async (orderId: string, newDate: Date, newTime: string) => {
    try {
      const [hours, minutes] = newTime.split(":").map(Number);
      newDate.setHours(hours, minutes);

      await axios.patch(`/api/orders/${orderId}`, { 
        estimatedDeliveryDate: newDate.toISOString() 
      });
      toast.success("Delivery date and time updated successfully");
      fetchOrders(); // Refresh the orders list
    } catch (error) {
      console.error("Error updating delivery date and time:", error);
      toast.error("Failed to update delivery date and time");
    }
  };

  const deleteOrder = async (orderId: string) => {
    try {
      await axios.delete(`/api/orders/${orderId}`);
      toast.success("Order deleted successfully");
      fetchOrders(); // Refresh the orders list
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Failed to delete order");
    }
  };

  const confirmDeleteOrder = async () => {
    if (selectedOrderKey) {
      await deleteOrder(selectedOrderKey);
      setSelectedOrderKey(null);
    }
  };

  const formatPrice = (price: number) => {
    return `₱${price}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="loading-dots">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Order Management</h2>
      
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No orders found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {orders.map((order, index) => (
            <div key={order._id} className="card-modern flex flex-col justify-between">
              <div>
                <p className="text-xs text-gray-400 mb-1 tracking-wide uppercase">
                  Order ID: <span className="font-semibold">C{index + 1}</span>
                </p>
                <p className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  {order.user?.name || order.address?.fullName || "N/A"}
                </p>
                <p className="text-xs text-gray-500 mb-2">
                  {order.user?.email || "N/A"}
                </p>
                <p className="text-xs text-gray-500 mb-2">
                  Placed: {format(new Date(order.createdAt), 'PPP')}
                </p>
                <p className="text-lg font-bold text-primary mb-2">
                  {formatPrice(order.total)}
                </p>
                <span className={`status-badge status-${order.status.toLowerCase()}`}>{order.status}</span>
                <p className="text-xs text-gray-500 mt-2">
                  Delivery to: <span className="font-medium">{order.address?.street || "N/A"}, {order.address?.city || "N/A"}, {order.address?.state || "N/A"} {order.address?.zipCode || "N/A"}, {order.address?.country || "N/A"}</span>
                </p>
              </div>

              <div className="border-t pt-4 mt-4">
                <h3 className="font-medium mb-2">Items</h3>
                <div className="space-y-2">
                  {(order.items || []).map((item, idx) => {
                    if (!item || !item.product) {
                      return (
                        <div key={idx} className="flex items-center gap-4">
                          <img
                            src="/placeholder.png"
                            alt="No image"
                            className="modern-img w-12 h-12"
                          />
                          <div>
                            <h4 className="font-medium">Unknown Product</h4>
                            <p className="text-sm text-gray-600">Quantity: N/A</p>
                            <p className="text-sm text-gray-600">N/A each</p>
                          </div>
                        </div>
                      );
                    }
                    return (
                      <div key={item.product._id} className="flex items-center gap-4">
                        <img
                          src={item.product.image || "/placeholder.png"}
                          alt={item.product.name || "No name"}
                          className="modern-img w-12 h-12"
                        />
                        <div>
                          <h4 className="font-medium">{item.product.name || "Unknown Product"}</h4>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity ?? "N/A"}</p>
                          <p className="text-sm text-gray-600">{formatPrice(item.price)} each</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <select
                  className="border rounded p-2 w-full"
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                >
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      Update Delivery Time
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-4 bg-white shadow-lg rounded-lg">
                    <div className="space-y-4">
                      <div className="flex flex-col">
                        <label htmlFor="time" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Select Time
                        </label>
                        <input
                          id="time"
                          type="time"
                          onChange={(e) => setSelectedTime(e.target.value)}
                          className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg p-2"
                        />
                      </div>
                      <Button
                        onClick={() =>
                          selectedTime &&
                          updateDeliveryDateTime(order._id, new Date(order.estimatedDeliveryDate), selectedTime)
                        }
                        className="w-full bg-green-600 hover:bg-green-500 text-white"
                      >
                        Save
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      onClick={() => setSelectedOrderKey(order._id)}
                      className="w-full"
                    >
                      Delete Order
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-white shadow-lg rounded-lg p-6 border border-gray-300">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the order.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={confirmDeleteOrder}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
