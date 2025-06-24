import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";

interface OrderPaymentDetailsProps {
  order: {
    paymentMethod: string;
    paymentStatus: string;
    updatedAt: string;
    total: number;
  };
}

const OrderPaymentDetails = ({ order }: OrderPaymentDetailsProps) => {
  const formatPrice = (price: number) => {
    return `₱${price.toFixed(2)}`;
  };

  const getFormattedDate = (date: string | Date | undefined | null) => {
    if (!date) return "N/A";
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return "N/A";
    return format(parsedDate, 'PPP');
  };

  return (
    <div className="space-y-2">
      <h3 className="font-semibold mb-4 dark:text-white">Payment Details</h3>
      <div className="flex justify-between text-sm">
        <span className="text-gray-600 dark:text-gray-400">Payment Method</span>
        <span className="font-medium dark:text-white capitalize">{order.paymentMethod}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-600 dark:text-gray-400">Payment Status</span>
        <span className="font-medium dark:text-white capitalize">{order.paymentStatus}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-600 dark:text-gray-400">Last Updated</span>
        <span className="font-medium dark:text-white">
          {getFormattedDate(order.updatedAt)}
        </span>
      </div>
      <Separator className="my-2" />
      <div className="flex justify-between text-lg font-bold">
        <span className="dark:text-white">Total Amount</span>
        <span className="dark:text-white">{formatPrice(order.total)}</span>
      </div>
    </div>
  );
};

export default OrderPaymentDetails;