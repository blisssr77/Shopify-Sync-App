import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, useNavigate } from "react-router-dom";
import './index.css';
import { supabase } from "./lib/supabaseClient";
import reportWebVitals from "./reportWebVitals";

import VelocityDashboard from "./components/VelocityDashboard";
import Dashboard from "./pages/Dashboard";


// App component
function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/dashboard");
      } else {
        navigate("/login");
      }
    });

    // Cleanup on unmount
    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="max-w-6xl mx-auto py-10">
      {/* <VelocityDashboard storeId="1bd97d0c-4e57-42e9-9236-afade7b8bdc6" /> */}
      <Dashboard storeId="1bd97d0c-4e57-42e9-9236-afade7b8bdc6" />
    </div>
  );
}

// Render the app
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();