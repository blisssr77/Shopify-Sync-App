import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { supabase } from "./lib/supabaseClient";

import Dashboard from "./pages/Dashboard";
import VelocityDashboard from "./components/VelocityDashboard";
import AuthPage from "./pages/AuthPage";
import useIdleLogout from "./hooks/useIdleLogout";

function App() {
  // Custom hook to handle idle logout
  useIdleLogout();
  // Navigate function from react-router
  const navigate = useNavigate();

  // Check if user is authenticated on initial load
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          navigate("/dashboard");
        } else {
          navigate("/login");
        }
      }
    );

    // Check current session on initial load
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="w-full min-h-screen">
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        <Route path="/dashboard" element={<Dashboard storeId="1bd97d0c-4e57-42e9-9236-afade7b8bdc6" />} />
        <Route path="/velocity" element={<VelocityDashboard storeId="1bd97d0c-4e57-42e9-9236-afade7b8bdc6" />} />
      </Routes>
    </div>
  );
}

export default App;
