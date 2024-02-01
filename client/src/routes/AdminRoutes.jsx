import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useLayoutEffect } from "react";
import Cookies from "js-cookie";

import { removeUser, setUser } from "../store/slices/authSlice";
import AuthRoutes from "./AuthRoutes";
import DashboardRoutes from "./DashboardRoutes";
import { useState } from "react";

function AdminRoutes() {
  const { isLoggedIn } = useSelector((state) => state.auth);
  const [isMounted, setIsMounted] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    const token = !!Cookies.get("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (token && Object.keys(user).length) {
      dispatch(setUser({ token, user }));
    } else {
      dispatch(removeUser());
      navigate("/auth");
    }
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <Routes>
      {!isLoggedIn ? (
        <Route path="/auth/*" element={<AuthRoutes />} />
      ) : (
        <Route path="/admin/*" element={<DashboardRoutes />} />
      )}
      <Route
        path="/*"
        element={isLoggedIn ? <DashboardRoutes /> : <AuthRoutes />}
      />
    </Routes>
  );
}

export default AdminRoutes;
