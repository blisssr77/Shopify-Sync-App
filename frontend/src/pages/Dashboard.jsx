import React from 'react';
import { Home, Package, ClipboardList, Boxes, BarChart2, Settings, HelpCircle, Phone, LogOut } from 'lucide-react';

export default function Dashboard() {
    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-[#0F172A] text-white flex flex-col justify-between">
                <div>
                    <div className="text-2xl font-bold px-6 py-6">📊 Mboard</div>
                    <nav className="flex flex-col gap-2 px-4 text-sm">
                        <SidebarItem icon={<Home size={18} />} label="Overview" />
                        <SidebarItem icon={<Package size={18} />} label="Product" />
                        <SidebarItem icon={<ClipboardList size={18} />} label="Orders" />
                        <SidebarItem icon={<Boxes size={18} />} label="Inventory" badge={2} />
                        <SidebarItem icon={<BarChart2 size={18} />} label="Analytics" />
                        <SidebarItem icon={<Settings size={18} />} label="Setting" />
                    </nav>
                </div>

                <div className="px-4 py-6 space-y-3 text-sm">
                    <SidebarItem icon={<HelpCircle size={18} />} label="Help Centre" />
                    <SidebarItem icon={<Phone size={18} />} label="Contact us" />
                    <SidebarItem icon={<LogOut size={18} />} label="Log out" />
                </div>
            </aside>

            {/* Placeholder for content */}
            <main className="flex-1 p-10">
                <h1 className="text-2xl font-semibold text-gray-800">Welcome Back!</h1>
                <p className="text-gray-500 mt-2">This is your dashboard content area.</p>
            </main>
        </div>
    );
}

function SidebarItem({ icon, label, badge }) {
    return (
        <div className="flex items-center justify-between px-3 py-2 rounded hover:bg-[#1E293B] cursor-pointer">
            <div className="flex items-center gap-3">
                {icon}
                <span>{label}</span>
            </div>
            {badge ? (
            <span className="bg-orange-500 text-xs px-2 py-0.5 rounded-full">{badge}</span>
            ) : null}
        </div>
    );
}
