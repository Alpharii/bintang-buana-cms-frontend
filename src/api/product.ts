import axios from "axios";
import { getAuthHeaders } from "./auth";

interface Product {
    name: string;
    price: number;
    description: string;
    image: string;
    discount: number;
    stock: number;
}

export const getProducts = async () => {
    try {
        const response = await axios.get("http://localhost:8080/products", {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
};

export const getProductById = async (id: number) => {
    try {
        const response = await axios.get(`http://localhost:8080/products/${id}`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching product:", error);
        return null;
    }
};

export const createProduct = async (product: Product) => {
    try {
        const response = await axios.post("http://localhost:8080/products", product, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error("Error creating product:", error);
        return null;
    }
};

export const updateProduct = async (id: number, updatedProduct: Product) => {
    try {
        const response = await axios.patch(`http://localhost:8080/products/${id}`, updatedProduct, {
            headers: getAuthHeaders(),
        });
        console.log("Product updated successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error updating product:", error);
        return null;
    }
};

export const deleteProduct = async (id: number) => {
    try {
        const response = await axios.delete(`http://localhost:8080/products/${id}`, {
            headers: getAuthHeaders(),
        });
        console.log("Product deleted successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error deleting product:", error);
        return null;
    }
};
