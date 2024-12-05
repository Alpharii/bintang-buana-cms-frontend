import axios from "axios";
import { getAuthHeaders } from "./auth";

interface CartItem {
  userId: number;
  productId: number;
  quantity: number;
}

// Mendapatkan semua cart items untuk user tertentu
export const getAllCartItems = async (userId: number) => {
  try {
    const response = await axios.get(`http://localhost:8080/cart-items/${userId}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return [];
  }
};

// Menambahkan item ke dalam cart
export const createCartItem = async (cartItem: CartItem) => {
  try {
    const response = await axios.post("http://localhost:8080/cart-items", cartItem, {
      headers: getAuthHeaders(),
    });
    console.log("Cart item created successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating cart item:", error);
    return null;
  }
};

// Mengupdate item dalam cart
export const updateCartItem = async (id: number, quantity: number) => {
  try {
    const response = await axios.patch(
      `http://localhost:8080/cart-items/${id}`,
      { quantity },
      {
        headers: getAuthHeaders(),
      }
    );
    console.log("Cart item updated successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating cart item:", error);
    return null;
  }
};

// Menghapus item dari cart
export const deleteCartItem = async (id: number) => {
  try {
    const response = await axios.delete(`http://localhost:8080/cart-items/${id}`, {
      headers: getAuthHeaders(),
    });
    console.log("Cart item deleted successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error deleting cart item:", error);
    return null;
  }
};
