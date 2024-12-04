// components/ProductModal.tsx
import React from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  discount: number;
  stock: number;
}

interface ProductModalProps {
  isEditing: boolean;
  newProduct: Product;
  setNewProduct: React.Dispatch<React.SetStateAction<Product>>;
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  handleCreateProduct: () => void;
  handleUpdateProduct: () => void;
  handleCancel: () => void;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof Product
  ) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({
  isEditing,
  newProduct,
  setNewProduct,
  showModal,
  handleCreateProduct,
  handleUpdateProduct,
  handleCancel,
  handleInputChange,
}) => {
  return (
    <>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">
              {isEditing ? 'Update Product' : 'Create Product'}
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {/* Product Name */}
              <div>
                <label className="text-sm font-semibold text-gray-300 mb-1 block">
                  Product Name
                </label>
                <input
                  type="text"
                  placeholder="Enter product name"
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                  className="border border-gray-700 bg-gray-900 text-white p-2 rounded placeholder-gray-500 w-full"
                />
              </div>

              {/* Price */}
              <div>
                <label className="text-sm font-semibold text-gray-300 mb-1 block">
                  Price
                </label>
                <input
                  type="number"
                  placeholder="Enter price"
                  value={newProduct.price}
                  onChange={(e) => handleInputChange(e, 'price')}
                  className="border border-gray-700 bg-gray-900 text-white p-2 rounded placeholder-gray-500 w-full"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-semibold text-gray-300 mb-1 block">
                  Description
                </label>
                <textarea
                  placeholder="Enter product description"
                  value={newProduct.description}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      description: e.target.value,
                    })
                  }
                  className="border border-gray-700 bg-gray-900 text-white p-2 rounded placeholder-gray-500 w-full"
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="text-sm font-semibold text-gray-300 mb-1 block">
                  Image URL
                </label>
                <input
                  type="text"
                  placeholder="Enter image URL"
                  value={newProduct.image}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, image: e.target.value })
                  }
                  className="border border-gray-700 bg-gray-900 text-white p-2 rounded placeholder-gray-500 w-full"
                />
              </div>

              {/* Discount */}
              <div>
                <label className="text-sm font-semibold text-gray-300 mb-1 block">
                  Discount
                </label>
                <input
                  type="number"
                  placeholder="Enter discount"
                  value={newProduct.discount}
                  onChange={(e) => handleInputChange(e, 'discount')}
                  className="border border-gray-700 bg-gray-900 text-white p-2 rounded placeholder-gray-500 w-full"
                />
              </div>

              {/* Stock */}
              <div>
                <label className="text-sm font-semibold text-gray-300 mb-1 block">
                  Stock
                </label>
                <input
                  type="number"
                  placeholder="Enter stock quantity"
                  value={newProduct.stock}
                  onChange={(e) => handleInputChange(e, 'stock')}
                  className="border border-gray-700 bg-gray-900 text-white p-2 rounded placeholder-gray-500 w-full"
                />
              </div>
            </div>

            <div className="mt-4 flex space-x-4 justify-end">
              <button
                onClick={handleCancel}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={isEditing ? handleUpdateProduct : handleCreateProduct}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                {isEditing ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductModal;
