import React from "react";

const Sidebar = ({ currentTab, setCurrentTab }) => {
    const tabs = ['Velocity Report', 'Sell-Through Report', 'Inventory Summary'];

    return (
        <aside className="w-64 bg-gray-100 h.full p-4 border-r">
            <h2 className="text-lg font-bold mb-4">📊 Reports</h2>
            <nav className="space-y-2">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        className={`block w-full text-left px-4 py-2 rounded ${currentTab === tab ? 'bg-indigo-600 text-white' : 'hover:bg-gray-200'}`}
                        onClick={() => setCurrentTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </nav>
            </aside>
    );
};

export default Sidebar;