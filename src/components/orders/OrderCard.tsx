import { format } from "date-fns";
import { Receipt } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import OrderItems from "./OrderItems";
import OrderPaymentDetails from "./OrderPaymentDetails";
import OrderDeliveryAddress from "./OrderDeliveryAddress";

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

interface OrderProps {
  order: {
    _id: string;
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
    createdAt: string;
    updatedAt: string;
    paymentMethod: string;
    paymentStatus: string;
  };
}

const OrderCard = ({ order }: OrderProps) => {
  return (
    <Card key={order._id} className="overflow-hidden">
      <CardHeader className="bg-gray-50 dark:bg-gray-800">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Order Receipt
            </CardTitle>
            <CardDescription>
              Order Date: {format(new Date(order.createdAt), 'PPP')}
            </CardDescription>
          </div>
          <span className="inline-block px-3 py-1 rounded-full text-sm font-medium capitalize bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
            {order.status}
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="space-y-6">
          <OrderItems items={order.items} />
          <Separator />
          <OrderPaymentDetails order={order} />
          <OrderDeliveryAddress address={order.address} />
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderCard;