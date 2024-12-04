import { jwtDecode } from 'jwt-decode';

export const checkTokenExpiration = (token: string): boolean => {
  try {
    const decodedToken: { exp: number } = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000); // Waktu sekarang dalam detik
    return decodedToken.exp < currentTime; // Jika `true`, token expired
  } catch (error) {
    console.error('Token decoding gagal:', error);
    return true; // Jika gagal decode, anggap expired
  }
};
