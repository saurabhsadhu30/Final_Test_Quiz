import { Routes, Route } from "react-router-dom";
import Auth from "../pages/auth/Auth";

function AuthRoutes() {
  return (
    <Routes>
      <Route path="/*" element={<Auth />} />
    </Routes>
  );
}

export default AuthRoutes;
