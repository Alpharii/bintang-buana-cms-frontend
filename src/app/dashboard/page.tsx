'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserId, getUserName } from '@/api/auth';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '@/api/product';
import{ createCartItem, getAllCartItems, deleteCartItem, updateCartItem } from '@/api/cart';
import ProductList from '@/components/ProductList';
import ProductModal from '@/components/ProductModal'; // Import komponen modal
import { checkTokenExpiration } from '../../utils/checkToken';
import CartList from '@/components/CartList';

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

  interface CartItem {
    id: number; // Tambahkan id untuk mencocokkan data dari API
    userId: number;
    productId: number;
    name: string; // Tambahkan properti ini untuk keperluan tampilan
    price: number; // Tambahkan untuk menampilkan harga produk
    quantity: number;
  }

  const [username, setUsername] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const userId = getUserId();
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

    if(!userId){
      router.push('/login');
      return;
    }


    if (userId) {
      getUserName(userId).then((name) => setUsername(name));
    }
    getAllCartItems(userId).then((cartItems) => setCartItems(cartItems));
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


  const handleAddToCart = async (product: Product) => {
    const existingItem = cartItems.find((item) => item.productId === product.id);

    if (existingItem) {
      // Jika item sudah ada, perbarui kuantitas
      const updatedQuantity = existingItem.quantity + 1;
      await updateCartItem(existingItem.id, updatedQuantity);
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === existingItem.id
            ? { ...item, quantity: updatedQuantity }
            : item
        )
      );
    } else {
      // Jika item belum ada, tambahkan item baru ke cart
      const newCartItem = await createCartItem({
        userId,
        productId: product.id,
        quantity: 1,
      });

      if (newCartItem) {
        setCartItems((prev) => [
          ...prev,
          {
            id: newCartItem.id,
            userId: newCartItem.userId,
            productId: newCartItem.productId,
            name: product.name,
            price: product.price,
            quantity: newCartItem.quantity,
          },
        ]);
      }
    }
  };

  const handleRemoveFromCart = async (id: number) => {
    await deleteCartItem(id);
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpdateQuantity = async (id: number, quantity: number) => {
    if (quantity < 1) return; // Pastikan kuantitas tidak kurang dari 1
    await updateCartItem(id, quantity);
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
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
        handleAddToCart={handleAddToCart}
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

      <CartList
        cartItems={cartItems}
        handleRemoveFromCart={handleRemoveFromCart}
        handleUpdateQuantity={handleUpdateQuantity}
      />
    </div>
  );
};

export default Dashboard;
