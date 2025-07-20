import { useState } from "react";
import DashboardBookChapters from "../components/dashboard/DashboardBookChapters";
import DashboardConferenceProceedings from "../components/dashboard/DashboardConferenceProceedings";
import DashboardEditedBooks from "../components/dashboard/DashboardEditedBooks";
import DashboardJournalArticles from "../components/dashboard/DashboardJournalArticles";
import DashboardPublicationStats from "../components/dashboard/DashboardPublicationStats";
import { useAuth } from "../context/useAuth";

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('stats');

    const tabs = [
        { id: 'stats', label: 'Publication Stats', component: <DashboardPublicationStats /> },
        { id: 'books', label: 'Edited Books', component: <DashboardEditedBooks /> },
        { id: 'articles', label: 'Journal Articles', component: <DashboardJournalArticles /> },
        { id: 'proceedings', label: 'Conference Proceedings', component: <DashboardConferenceProceedings /> },
        { id: 'chapters', label: 'Book Chapters', component: <DashboardBookChapters /> },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow-xl rounded-xl overflow-hidden">
                    {/* Dashboard Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-5 sm:px-8 sm:py-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-white">Research Dashboard</h1>
                                <p className="mt-1 text-blue-100">Welcome back, {user.email}</p>
                            </div>
                            <button
                                onClick={logout}
                                className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 transition-colors duration-200 font-medium"
                            >
                                Logout
                            </button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="p-6 sm:p-8">
                        {/* Tab Navigation */}
                        <div className="mb-8">
                            <div className="border-b border-gray-200">
                                <nav className="-mb-px flex space-x-2 sm:space-x-6 overflow-x-auto pb-2">
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm sm:text-base ${activeTab === tab.id
                                                ? 'border-indigo-500 text-indigo-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                                }`}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </nav>
                            </div>
                        </div>

                        {/* Tab Content */}
                        <div className="rounded-lg bg-gray-50 p-4 sm:p-6 shadow-inner">
                            {tabs.find(tab => tab.id === activeTab)?.component}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;