import { LayoutDashboard, Box, ShoppingCart, PackageSearch, BarChart3, Settings, HelpCircle, Phone, LogOut } from "lucide-react";
import { cn } from "../lib/utils"; // if you’re using clsx or similar utility
import { useState } from "react";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("Overview");

  const navItems = [
    { name: "Overview", icon: LayoutDashboard },
    { name: "Product", icon: Box },
    { name: "Orders", icon: ShoppingCart },
    { name: "Inventory", icon: PackageSearch, badge: 2 },
    { name: "Analytics", icon: BarChart3 },
    { name: "Setting", icon: Settings },
  ];

  const footerItems = [
    { name: "Help Centre", icon: HelpCircle },
    { name: "Contact Us", icon: Phone },
    { name: "Log out", icon: LogOut, danger: true },
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0d1321] text-white flex flex-col justify-between py-6 px-4">
        <div>
          <div className="flex items-center mb-10 px-2">
            <div className="bg-orange-500 w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold mr-2">
              M
            </div>
            <span className="text-lg font-semibold">Mboard</span>
          </div>

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

        <div className="space-y-2">
          {footerItems.map(({ name, icon: Icon, danger }) => (
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
          ))}
        </div>
      </aside>

      {/* Main content placeholder */}
      <main className="flex-1 bg-[#f9fafb] p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold">Welcome to {activeTab}</h1>
        
        
        <h1 className="bg-emerald-500 text-white p-4 rounded">Welcome to {activeTab}</h1>
        <p className="text-sm text-gray-600 mt-2">Main content will appear here.</p>
      </main>
    </div>
  );
}
