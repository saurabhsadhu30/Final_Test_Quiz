import { Routes, Route } from "react-router-dom";

import PublicRoutes from "./routes/PublicRoutes";
import AdminRoutes from "./routes/AdminRoutes";

function App() {
  return (
    <Routes>
      <Route path="/public/*" element={<PublicRoutes />} />
      <Route path="/*" element={<AdminRoutes />} />
    </Routes>
  );
}

export default App;
