import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // ✅ ใช้ named import

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token"); // ดึง token จาก localStorage

  if (!token) {
    return <Navigate to="/loginadmin" replace />; // ถ้าไม่มี token ให้ไปหน้า login
  }

  try {
    const decoded = jwtDecode(token); // ถอดรหัส token
    const userRole = decoded.role; // ดึง role ออกจาก token

    // ตรวจสอบว่า role ของ user อยู่ใน allowedRoles หรือไม่
    if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/unauthorized" replace />; // Redirect ไปหน้า unauthorized ถ้าไม่มีสิทธิ์
    }

    return children; // ถ้า role ถูกต้อง ให้แสดง component ที่ป้องกันไว้
  } catch (error) {
    console.error("Invalid token", error);
    localStorage.removeItem("token"); // ลบ token ถ้าผิดพลาด
    return <Navigate to="/loginpage" replace />; // ส่งไปหน้า login
  }
};

export default ProtectedRoute;
