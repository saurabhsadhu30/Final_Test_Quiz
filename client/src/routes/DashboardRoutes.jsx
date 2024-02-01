import { Routes, Route } from "react-router-dom";

import Dashboard from "../pages/dashboard/Dashboard";
import Analytics from "../pages/dashboard/Analytics";
import Quiz from "../pages/dashboard/Quiz";
import MainLayout from "../components/MainLayout";
import QuizAnalysis from "../pages/dashboard/QuizAnalysis";

function DashboardRoutes() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/analytics/:quizId" element={<QuizAnalysis />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/*" element={<Dashboard />} />
      </Routes>
    </MainLayout>
  );
}

export default DashboardRoutes;
