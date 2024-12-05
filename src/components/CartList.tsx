import React from 'react';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface CartListProps {
  cartItems: CartItem[];
  handleRemoveFromCart: (id: number) => void;
  handleUpdateQuantity: (id: number, quantity: number) => void;
}

const CartList: React.FC<CartListProps> = ({
  cartItems,
  handleRemoveFromCart,
  handleUpdateQuantity,
}) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Cart List</h2>
      <ul className="space-y-4">
        {cartItems.map((item) => (
          <li key={item.id} className="border border-gray-700 p-4 rounded bg-gray-700">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                <p className="text-gray-400">Price: ${item.price}</p>
                <p className="text-gray-400">Quantity: {item.quantity}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleRemoveFromCart(item.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Remove
                </button>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    handleUpdateQuantity(item.id, parseInt(e.target.value, 10))
                  }
                  className="w-16 px-2 py-1 rounded bg-gray-800 text-white border border-gray-600"
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CartList;
