import axios from "axios";

const getAuthToken = () => {
    return localStorage.getItem('token'); // Sesuaikan dengan cara Anda menyimpan token
  };

export const getAuthHeaders = () => {
    const token = getAuthToken();
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
    return {}; // Jika token tidak ada, kembalikan objek kosong
};

export const getUserId = (): number => {
  const userId = localStorage.getItem('userId');
  return userId ? parseInt(userId, 10) : 0; // Kembalikan 0 jika userId null
};

export const getUserName = async (id: number): Promise<string> => {
  try {
    const response = await axios.get(`http://localhost:8080/user/${id}`, {
      headers: getAuthHeaders(),
    });
    console.log(response.data.user.username);
    return response.data.user.username;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return "";
  }
};
