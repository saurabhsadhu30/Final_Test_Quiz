import { Route, Routes } from "react-router-dom";

import AttemptQuiz from "../pages/public/AttemptQuiz";

function PublicRoutes() {
  return (
    <Routes>
      <Route path="/*" element={<AttemptQuiz />} />
    </Routes>
  );
}

export default PublicRoutes;
