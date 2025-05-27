import React from "react";
import VelocityDashboard from "./components/VelocityDashboard";
import Dashboard from "./pages/Dashboard";


function App() {
  return (
    <div className="max-w-6xl mx-auto py-10">
      <VelocityDashboard storeId="1bd97d0c-4e57-42e9-9236-afade7b8bdc6" />
      {/* <Dashboard storeId="1bd97d0c-4e57-42e9-9236-afade7b8bdc6" /> */}
    </div>
  )
}

export default App;
