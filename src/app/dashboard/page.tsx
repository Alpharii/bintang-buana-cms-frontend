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
import ProductModal from '@/components/ProductModal'; // Import komponen modal
import { checkTokenExpiration } from '../../utils/checkToken';

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
    id: 0,
    name: '',
    price: 0,
    description: '',
    image: '',
    discount: 0,
    stock: 0,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentProductId, setCurrentProductId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userIdString = localStorage.getItem('userId');

    if (!token) {
      router.push('/login');
      return;
    }

    const isTokenExpired = checkTokenExpiration(token);
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
      // Menghapus 'id' dari newProduct tanpa mengubah tipe data
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...productWithoutId } = newProduct;
      // Pastikan produk yang dikirimkan mengonversi nilai ke tipe yang sesuai
      const productData = {
        ...productWithoutId,
        price: Number(productWithoutId.price), // Mengonversi price ke number
        discount: Number(productWithoutId.discount), // Mengonversi discount ke number
        stock: Number(productWithoutId.stock), // Mengonversi stock ke number
      };

      // Mengirimkan data produk yang sudah diperbaiki
      await createProduct(productData);

      // Reset state
      setNewProduct({
        id: 0,
        name: '',
        price: 0,
        description: '',
        image: '',
        discount: 0,
        stock: 0,
      });
      fetchProducts();
      setShowModal(false);
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  const handleUpdateProduct = async () => {
    if (currentProductId !== null) {
      try {
        // Mengonversi tipe data price, discount, dan stock ke number
        const updatedProduct = {
          ...newProduct,
          price: parseFloat(newProduct.price as unknown as string), // Pastikan price menjadi number
          discount: parseFloat(newProduct.discount as unknown as string), // Pastikan discount menjadi number
          stock: parseInt(newProduct.stock as unknown as string), // Pastikan stock menjadi number
        };

        console.log(updatedProduct);
        await updateProduct(currentProductId, updatedProduct);
        fetchProducts();
        setShowModal(false);
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
    setShowModal(false);
    setNewProduct({
      id: 0,
      name: '',
      price: 0,
      description: '',
      image: '',
      discount: 0,
      stock: 0,
    });
    setIsEditing(false);
    setCurrentProductId(null);
  };

  const handleEditProduct = (product: Product) => {
    setNewProduct(product);
    setCurrentProductId(product.id);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof Product // Make sure this matches the 'Product' interface
  ) => {
    setNewProduct({ ...newProduct, [field]: e.target.value });
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-white mb-4">Dashboard</h1>
      <h2 className="text-xl text-white mb-4">Welcome, {username}!</h2>
      <button
        onClick={() => setShowModal(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Create New Product
      </button>
      <ProductList
        products={products}
        handleEditProduct={handleEditProduct}
        handleDeleteProduct={handleDeleteProduct}
      />

      {/* Modal */}
      <ProductModal
        isEditing={isEditing}
        newProduct={newProduct}
        setNewProduct={setNewProduct}
        showModal={showModal}
        setShowModal={setShowModal}
        handleCreateProduct={handleCreateProduct}
        handleUpdateProduct={handleUpdateProduct}
        handleCancel={handleCancel}
        handleInputChange={handleInputChange}
      />
    </div>
  );
};

export default Dashboard;
