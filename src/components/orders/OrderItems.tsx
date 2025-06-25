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

interface OrderItemsProps {
  items: OrderItem[];
}

const OrderItems = ({ items }: OrderItemsProps) => {
  const formatPrice = (price: number) => {
    return `₱${price.toFixed(2)}`;
  };

  return (
    <div>
      <h3 className="font-semibold mb-4 dark:text-white">Items Purchased</h3>
      <div className="space-y-4">
        {(items || []).map((item, idx) => {
          if (!item || !item.product) {
            return (
              <div key={idx} className="flex items-center gap-4">
                <img
                  src="/placeholder.png"
                  alt="No image"
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-grow">
                  <h4 className="font-medium dark:text-white">Unknown Product</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Quantity: N/A × N/A
                  </p>
                  <p className="font-medium dark:text-white">
                    Subtotal: N/A
                  </p>
                </div>
              </div>
            );
          }
          return (
            <div key={item.product._id} className="flex items-center gap-4">
              <img
                src={item.product.image || "/placeholder.png"}
                alt={item.product.name || "No name"}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-grow">
                <h4 className="font-medium dark:text-white">{item.product.name || "Unknown Product"}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Quantity: {typeof item.quantity === 'number' ? item.quantity : "N/A"} × {typeof item.price === 'number' ? formatPrice(item.price) : "N/A"}
                </p>
                <p className="font-medium dark:text-white">
                  Subtotal: {typeof item.price === 'number' && typeof item.quantity === 'number' ? formatPrice(item.price * item.quantity) : "N/A"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderItems;