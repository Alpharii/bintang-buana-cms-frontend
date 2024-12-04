'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserName } from '@/api/auth';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '@/api/product';
import ProductList from '@/components/ProductList';
import { checkTokenExpiration } from '@/utils/checkToken.';

const Dashboard = () => {
  interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    image: string;
    discount: number;
    stock: number;
  }

  const [username, setUsername] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: 0,
    description: '',
    image: '',
    discount: 0,
    stock: 0,
  });
  const [isEditing, setIsEditing] = useState(false); // Flag untuk menandakan apakah sedang mengedit
  const [currentProductId, setCurrentProductId] = useState<number | null>(null); // ID produk yang sedang diedit
  const [showModal, setShowModal] = useState(false); // Modal visibility

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userIdString = localStorage.getItem('userId');

    if (!token) {
      router.push('/login');
      return;
    }

    const isTokenExpired = checkTokenExpiration(token); // Periksa apakah token kedaluwarsa
    if (isTokenExpired) {
      router.push('/login');
      return;
    }

    const userId = userIdString ? parseInt(userIdString, 10) : null;

    if (userId) {
      getUserName(userId).then((name) => setUsername(name));
    }

    fetchProducts();
  }, [router]);

  const fetchProducts = async () => {
    try {
      const fetchedProducts = await getProducts();
      setProducts(fetchedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleCreateProduct = async () => {
    try {
      await createProduct(newProduct);
      setNewProduct({
        name: '',
        price: 0,
        description: '',
        image: '',
        discount: 0,
        stock: 0,
      });
      fetchProducts();
      setShowModal(false); // Close modal after create
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  const handleUpdateProduct = async () => {
    if (currentProductId !== null) {
      try {
        await updateProduct(currentProductId, newProduct);
        fetchProducts();
        setShowModal(false); // Close modal after update
        setIsEditing(false);
        setCurrentProductId(null);
      } catch (error) {
        console.error('Error updating product:', error);
      }
    }
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      await deleteProduct(id);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleCancel = () => {
    setShowModal(false); // Menutup modal
    setNewProduct({
      name: '',
      price: 0,
      description: '',
      image: '',
      discount: 0,
      stock: 0,
    }); // Reset form to initial state
    setIsEditing(false); // Reset editing flag
    setCurrentProductId(null); // Reset current product ID
  };

  const handleEditProduct = (product: Product) => {
    setNewProduct(product);
    setCurrentProductId(product.id);
    setIsEditing(true); // Set editing flag to true
    setShowModal(true); // Show modal for editing
  };

  // Validasi input untuk harga, diskon, dan stok
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof typeof newProduct
  ) => {
    const value = e.target.value;
    if (value === '' || Number(value) >= 0) {
      setNewProduct({
        ...newProduct,
        [field]: value === '' ? 0 : Number(value), // Pastikan input kosong menjadi 0
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white">Dashboard</h1>
          <p className="text-lg text-gray-400 mt-2">
            Welcome, <span className="font-semibold">{username}</span>
          </p>
        </header>

        {/* Button to show Create Product modal */}
        <div className="mb-6 text-center">
          <button
            onClick={() => {
              setShowModal(true);
              setIsEditing(false);
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create New Product
          </button>
        </div>

        <ProductList
          products={products}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
        />

        {/* Modal untuk Create / Update Product */}
        {/* Modal untuk Create/Update Product */}
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
                  onClick={() => handleCancel()}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={
                    isEditing ? handleUpdateProduct : handleCreateProduct
                  }
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  {isEditing ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
