"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserName } from "../../api/auth";

const Dashboard = () => {
  const [username, setUsername] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userIdString = localStorage.getItem("userId"); // Ambil userId sebagai string
  
    if (!token) {
      router.push("/login");
      return;
    }
  
    // Konversi userId dari string ke number
    const userId = userIdString ? parseInt(userIdString, 10) : null;
  
    if (userId) {
      getUserName(userId).then((name) => {
        setUsername(name);
      });
    }
  }, [router]);
  

  return (
    <div>
      <h1>Ini Dashboard</h1>
      <h1>Welcome {username ? username : ""}</h1>
    </div>
  );
};

export default Dashboard;
