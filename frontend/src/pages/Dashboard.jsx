import { LayoutDashboard, Box, ShoppingCart, PackageSearch, BarChart3, Settings, HelpCircle, Phone, LogOut, BarChart2 } from "lucide-react";
import { cn } from "../lib/utils"; 
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import VelocityDashboard from "../components/VelocityDashboard";

export default function Dashboard() {
  // State to manage the active tab
  const [activeTab, setActiveTab] = useState("Overview");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [storeId, setStoreId] = useState(null); 

  const navigate = useNavigate();

  // Fetch the storeId from the user's profile on component mount
  useEffect(() => {
    const fetchStoreId = async () => {
      // Get the current user
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error);
        return;
      }

      const userId = user.id;

      // Get user's storeId from profile table (if you have one)
      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('store_id')
        .eq('id', userId)
        .single();

      // Check if the profile data was fetched successfully
      if (profileError) {
        console.error("Profile fetch error:", profileError);
      } else {
        setStoreId(data.store_id);
      }
    };

    fetchStoreId();
  }, []);

  // Handle logout functionality
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error.message);
    } else {
      navigate("/login");
    }
  };

  // Define the navigation items and footer items
  const navItems = [
    { name: "Overview", icon: LayoutDashboard },
    { name: "Product", icon: Box },
    { name: "Orders", icon: ShoppingCart },
    { name: "Inventory", icon: PackageSearch, badge: 3 }, // Example badge
    { name: "Velocity Chart", icon: BarChart2, badge: 5 }, // Example badge
    { name: "Analytics", icon: BarChart3 },
    { name: "Setting", icon: Settings },
  ];

  // Define the footer items
  const footerItems = [
    { name: "Help Centre", icon: HelpCircle },
    { name: "Contact Us", icon: Phone },
    { name: "Log out", icon: LogOut, danger: true },
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar Header */}
      <aside className="w-64 bg-[#0d1321] text-white flex flex-col justify-between py-6 px-4">
        <div>
          <div className="flex items-center mb-10 px-2">
            <div className="bg-orange-500 w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold mr-2">
              M
            </div>
            <span className="text-lg font-semibold">Mboard</span>
          </div>

          {/* navigation items */}
          <nav className="space-y-2">
            {navItems.map(({ name, icon: Icon, badge }) => (
              <button
                key={name}
                onClick={() => setActiveTab(name)}
                className={cn(
                  "flex items-center w-full px-3 py-2 rounded-lg text-sm hover:bg-[#1c2130] transition relative",
                  activeTab === name && "bg-[#1c2130] font-semibold"
                )}
              >
                <Icon className="w-5 h-5 mr-3" />
                {name}
                {badge && (
                  <span className="ml-auto bg-orange-500 text-xs font-bold px-2 py-0.5 rounded-full">
                    {badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Footer items */}
        <div className="space-y-2">
        {footerItems.map(({ name, icon: Icon, danger }) => {
          if (name === "Log out") {
            return showLogoutConfirm ? (
              <div key="logout-confirm" className="px-3">
                <p className="text-sm text-gray-300 mb-2">Are you sure you want to log out?</p>
                <div className="flex gap-2">
                  <button
                    onClick={handleLogout}
                    className="flex-1 bg-orange-500 hover:bg-orange-700 text-white text-sm py-1 rounded"
                  >
                    Log out
                  </button>
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white text-sm py-1 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                key="logout"
                onClick={() => setShowLogoutConfirm(true)}
                className={cn(
                  "flex items-center w-full px-3 py-2 rounded-lg text-sm hover:bg-[#1c2130] transition",
                  "text-orange-400 hover:text-orange-300"
                )}
              >
                <Icon className="w-5 h-5 mr-3" />
                {name}
              </button>
            );
          }

          return (
            <button
              key={name}
              onClick={() => console.log(`${name} clicked`)}
              className={cn(
                "flex items-center w-full px-3 py-2 rounded-lg text-sm hover:bg-[#1c2130] transition",
                danger && "text-orange-400 hover:text-orange-300"
              )}
            >
              <Icon className="w-5 h-5 mr-3" />
              {name}
            </button>
          );
        })}
        </div>
      </aside>

      {/* Main content placeholder */}
      <main className="flex-1 bg-[#f9fafb] p-6 overflow-y-auto">
        {activeTab === "Velocity Chart" ? (
          !storeId ? (
            <p>Loading...</p>
          ) : (
            <VelocityDashboard storeId={storeId} />
          )
        ) : (
          <>
            <h1 className="text-2xl font-bold">Welcome to {activeTab}</h1>
            <p className="text-sm text-gray-600 mt-2">Main content will appear here.</p>
          </>
        )}
      </main>
    </div>
  );
}
