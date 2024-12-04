'use client';

import React from 'react';
import Image from 'next/image';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  discount: number;
  stock: number;
}

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Product List</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="border border-gray-700 p-4 rounded shadow-sm bg-gray-700"
          >
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-gray-400">Price: ${product.price}</p>
            <p className="text-gray-400">Stock: {product.stock}</p>
            <p className="text-gray-500 mt-2">{product.description}</p>
            <Image
              src={product.image}
              alt={product.name}
              width={200}
              height={200}
            ></Image>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => onEdit(product)}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(product.id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
