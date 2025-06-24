interface OrderDeliveryAddressProps {
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    description: string;
    fullName: string;
  };
}

const OrderDeliveryAddress = ({ address }: OrderDeliveryAddressProps) => {
  if (!address) {
    return (
      <div>
        <h3 className="font-semibold mb-2 dark:text-white">Delivery Address</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">No address provided.</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="font-semibold mb-2 dark:text-white">Delivery Address</h3>
      {address.fullName && (
        <p className="text-sm font-medium dark:text-white mb-1">
          {address.fullName}
        </p>
      )}
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {address.street}, {address.city}, {address.state} {address.zipCode}, {address.country}
      </p>
      {address.description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {address.description}
        </p>
      )}
    </div>
  );
};

export default OrderDeliveryAddress;