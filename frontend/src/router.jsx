import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import Home     from "./pages/Home";
import Upload   from "./pages/Upload";
import About    from "./pages/About";
import Contact  from "./pages/Contact";
import Login    from "./pages/Login";
import Register from "./pages/Register";

export default function Router() {
  return (
    <MainLayout>
      <Routes>
        {/* Public routes */}
        <Route path="/"         element={<Home />} />
        <Route path="/contact"  element={<Contact />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes — must be logged in */}
        <Route path="/upload" element={
          <ProtectedRoute><Upload /></ProtectedRoute>
        } />
        <Route path="/about" element={
          <ProtectedRoute><About /></ProtectedRoute>
        } />
      </Routes>
    </MainLayout>
  );
}
